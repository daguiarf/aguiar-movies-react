import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecodedUser {
  user_id: number;
  username: string;
  email: string;
  token_type: string;
  exp: number;
}

interface AuthState {
  user: DecodedUser | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<DecodedUser>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
