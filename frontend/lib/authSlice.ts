// lib/features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  ho_ten: string;
  anh_dai_dien: any;
  email: string;
  token: string | null;
  so_dien_thoai: string | null;
  dia_chi: string | null;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;