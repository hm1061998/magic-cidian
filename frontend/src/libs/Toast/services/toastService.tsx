import React from "react";
import { createRoot, Root } from "react-dom/client";
import ToastContainer from "../components/ToastContainer";
import { ToastMessage, ToastType } from "../types";

class ToastService {
  private toasts: ToastMessage[] = [];
  private root: Root | null = null;
  private container: HTMLDivElement | null = null;

  private renderUI() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-root";
      document.body.appendChild(this.container);
      this.root = createRoot(this.container);
    }

    if (this.root) {
      this.root.render(
        <React.StrictMode>
          <ToastContainer
            toasts={this.toasts}
            onRemove={(id) => this.remove(id)}
          />
        </React.StrictMode>
      );
    }
  }

  show(message: string, type: ToastType = "info", duration: number = 3500) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type };

    this.toasts = [...this.toasts, newToast];
    this.renderUI();

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(message: string) {
    this.show(message, "success");
  }

  error(message: string | string[]) {
    if (Array.isArray(message)) {
      message.forEach((msg) => this.show(msg, "error"));
    } else {
      this.show(message, "error");
    }
  }

  info(message: string) {
    this.show(message, "info");
  }

  warning(message: string) {
    this.show(message, "warning");
  }

  remove(id: string) {
    const originalLength = this.toasts.length;
    this.toasts = this.toasts.filter((t) => t.id !== id);
    if (this.toasts.length !== originalLength) {
      this.renderUI();
    }
  }
}

export const toast = new ToastService();
