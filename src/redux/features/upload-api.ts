import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';


export const uploadApi = createApi({
    reducerPath: 'uploadApi',
    baseQuery: customBaseQueryWithReauth,
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => `/users`,
        }),
    }),
});

export const {
useGetUsersQuery
} = uploadApi;

