export interface ModalOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}
