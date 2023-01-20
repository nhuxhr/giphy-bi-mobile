import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

interface IAuthState {
  user: User | undefined;
}

const initialState: IAuthState = {
  user: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = undefined;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export const auth = authSlice.reducer;
