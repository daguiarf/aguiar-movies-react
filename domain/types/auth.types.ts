export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface RefreshPayload {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}
