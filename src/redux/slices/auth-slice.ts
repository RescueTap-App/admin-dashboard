import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    verified: boolean;
    profileImage?: string;
    // Add other fields you care to persist
}

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                token: string;
                user: User;
            }>
        ) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        resetUser: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, resetUser } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState, User };
