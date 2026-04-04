import api from "@/infra/http/api";
import { unwrap } from "@/infra/http/unwrap";
import { IAuthRepository } from "@/domain/contracts/auth.contracts";
import {
  AuthTokens,
  LoginPayload,
  RefreshPayload,
  RefreshResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/domain/types/auth.types";

export class AuthRepository implements IAuthRepository {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await api.post("/api/auth/register/", payload);
    return unwrap<RegisterResponse>(data);
  }

  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { data } = await api.post("/api/auth/login/", payload);
    return unwrap<AuthTokens>(data);
  }

  async refresh(payload: RefreshPayload): Promise<RefreshResponse> {
    const { data } = await api.post("/api/auth/refresh/", payload);
    return unwrap<RefreshResponse>(data);
  }
}

export const authRepository = new AuthRepository();
