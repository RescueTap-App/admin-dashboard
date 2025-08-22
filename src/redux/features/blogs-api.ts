import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';
import { BlogDataTypes } from '@/types/blogs.types';
import { CreateCategoryFormData } from '@/constants/validations/blogs';

export const blogsApi = createApi({
    reducerPath: 'blogsApi',
    baseQuery: customBaseQueryWithReauth,
    tagTypes: ['Category', 'Blogs', 'Tips'],
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: ({ data }: { data: CreateCategoryFormData }) => ({
                url: `/blogs/categories`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, data }: { id?: string, data: CreateCategoryFormData }) => ({
                url: `/blogs/categories/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: ({ id }: { id?: string }) => ({
                url: `/blogs/categories/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Category'],
        }),
        getallCategory: builder.query({
            query: () => `/blogs/categories`,
            providesTags: ['Category'],
        }),
        getaCategory: builder.query({
            query: (id) => `/blogs/categories/${id}`,
            providesTags: ['Category'],
        }),

        // blogs sections
        createBlog: builder.mutation({
            query: ({ data }: { data: BlogDataTypes }) => ({
                url: `/blogs`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Blogs'],
        }),
        updateBlog: builder.mutation({
            query: ({ id, data }: { id?: string; data: BlogDataTypes }) => ({
                url: `/blogs/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['Blogs'],
        }),
        getallBlogs: builder.query({
            query: () => `/blogs`,
            providesTags: ['Blogs'],
        }),
        getaBlog: builder.query({
            query: (id) => `/blogs/${id}`,
            providesTags: ['Blogs'],
        }),
        deleteBlog: builder.mutation({
            query: ({ id }: { id?: string }) => ({
                url: `/blogs/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Blogs'],
        }),
        getallTips: builder.query({
            query: () => `/tips`,
            providesTags: ['Tips'],
        }),
        getTipById: builder.query({
            query: (id: string) => `/tips/${id}`,
            providesTags: ['Tips'],
        }),
        createTips: builder.mutation({
            query: ({ content }: { content: string }) => ({
                url: `/tips`,
                method: "POST",
                body: { content }, 
            }),
            invalidatesTags: ['Tips'],
        }),
        editTips: builder.mutation({
            query: ({ id, data }: { id?: string, data: { content: string } }) => ({
                url: `/tips/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Tips'],
        }),
        deleteTip: builder.mutation({
            query: ({ id }: { id?: string }) => ({
                url: `/tips/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Tips'],
        }),
    }),
});

export const {
    useCreateBlogMutation,
    useCreateCategoryMutation,
    useDeleteBlogMutation,
    useDeleteCategoryMutation,
    useGetaBlogQuery,
    useGetaCategoryQuery,
    useGetallBlogsQuery,
    useGetallCategoryQuery,
    useUpdateCategoryMutation,
    useUpdateBlogMutation,
    useCreateTipsMutation,
    useEditTipsMutation,
    useDeleteTipMutation,
    useGetallTipsQuery,
    useGetTipByIdQuery
} = blogsApi;

