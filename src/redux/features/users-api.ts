import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';
import { CreateUserFormData } from "@/constants/validations/register-user"

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: customBaseQueryWithReauth,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => `/users`,
            providesTags: ['Users'],
        }),
        createUser: builder.mutation({
            query: ({ data }: { data: CreateUserFormData }) => ({
                url: '/users/createUser',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),

    }),
});

export const {
    useGetUsersQuery,
    useCreateUserMutation,
} = usersApi;

