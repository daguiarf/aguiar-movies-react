import { DecodedUser } from "@/store/slices/authSlice";

export function decodeJwt(token: string): DecodedUser | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded as DecodedUser;
  } catch {
    return null;
  }
}
