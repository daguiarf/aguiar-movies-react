import { authRepository } from "@/infra/repositories/auth.repository";
import { LoginPayload, RegisterPayload } from "@/domain/types/auth.types";
import { decodeJwt } from "@/lib/jwt";
import { store } from "@/store";
import { setUser, clearUser } from "@/store/slices/authSlice";

export const authService = {
  async register(payload: RegisterPayload) {
    return authRepository.register(payload);
  },

  async login(payload: LoginPayload) {
    const tokens = await authRepository.login(payload);
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);

      const decoded = decodeJwt(tokens.access);
      if (decoded) {
        store.dispatch(setUser(decoded));
      }
    }
    return tokens;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
      store.dispatch(clearUser());
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },

  getUsername(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("username");
  },

  setUsername(username: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("username", username);
    }
  },
};
