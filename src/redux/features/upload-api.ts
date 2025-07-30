import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';


export const uploadApi = createApi({
    reducerPath: 'uploadApi',
    baseQuery: customBaseQueryWithReauth,
    endpoints: (builder) => ({
        uploadFile: builder.mutation({
            query: ({ file }: { file: FormData }) => ({
                url: `/upload`,
                method: "POST",
                body: file
            })
        }),
    }),
});

export const {
    useUploadFileMutation
} = uploadApi;

