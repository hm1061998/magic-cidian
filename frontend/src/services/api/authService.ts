import { http } from "./httpService";

/**
 * Authentication Service
 * Handles user authentication and session management
 * Note: Auth state is managed by Redux (authSlice), not localStorage
 */

export const registerUser = async (username: string, pass: string) => {
  const response = await http.post("/auth/register", { username, pass });
  return response.data;
};

export const loginAdmin = async (username: string, pass: string) => {
  const response = await http.post("/auth/login", { username, pass });

  // Set hint for frontend to fetch user on next load
  localStorage.setItem("auth_hint", "true");
  return response.data;
};

export const logoutAdmin = async () => {
  try {
    await http.post("/auth/logout");
  } catch (e) {
    console.warn("Logout API call failed", e);
  } finally {
    // Clean up localStorage
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("auth_hint");
  }
};

export const getByMe = async () => {
  const response = await http.get("/auth/me");
  return response.data;
};
