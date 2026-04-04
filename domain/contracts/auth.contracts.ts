import {
  AuthTokens,
  LoginPayload,
  RefreshPayload,
  RefreshResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/domain/types/auth.types";

export interface IAuthRepository {
  register(payload: RegisterPayload): Promise<RegisterResponse>;
  login(payload: LoginPayload): Promise<AuthTokens>;
  refresh(payload: RefreshPayload): Promise<RefreshResponse>;
}
