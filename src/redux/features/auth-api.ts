import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customBaseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            })
        }),
        sendOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/send-otp',
                method: 'POST',
                body: data
            })
        }),
         resetPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data
            })
        }),
         verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: data
            })
        }),
    }),
});

export const {
    useLoginMutation,
    useSendOtpMutation,
    useResetPasswordMutation,
    useVerifyOtpMutation
} = authApi;

