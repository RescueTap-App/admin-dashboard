import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';
import { CreateUserFormData } from "@/constants/validations/register-user"
import { UserListType } from '@/types/users.types';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: customBaseQueryWithReauth,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        getUsers: builder.query<UserListType[], void>({
            query: () => `/users`,
            providesTags: ['Users'],
        }),
        getUserById: builder.query({
            query: (id: string) => `/users/${id}`,
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
        deleteUser: builder.mutation({
            query: (userId: string) => ({
                url: `/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users']
        }),
        getActiveSubcription: builder.query({
            query: (userId: string) => `/subscriptions/active/${userId}`
        })
    }),
});

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useGetUserByIdQuery,
    useDeleteUserMutation,
    useGetActiveSubcriptionQuery
} = usersApi;

