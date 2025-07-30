import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';


export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: customBaseQueryWithReauth,
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => `/users`,
        }),
    }),
});

export const {
useGetUsersQuery
} = usersApi;

