import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';
import { BlogDataTypes } from '@/types/blogs.types';
import { CreateCategoryFormData, CreateTipSchemaType } from '@/constants/validations/blogs';
import { CreateTipCategorySchemaType } from "@/constants/validations/blogs";;

// Add Tip Category interface for type safety
export interface TipCategory {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const blogsApi = createApi({
    reducerPath: 'blogsApi',
    baseQuery: customBaseQueryWithReauth,
    tagTypes: ['Category', 'Blogs', 'Tips', 'TipCategories'],
    endpoints: (builder) => ({
        // Category endpoints (Blog Categories)
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

        // Blogs sections
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

        // Tips endpoints
        getallTips: builder.query({
            query: () => `/tips`,
            providesTags: ['Tips'],
        }),
        getTipById: builder.query({
            query: (id: string) => `/tips/${id}`,
            providesTags: ['Tips'],
        }),
        createTips: builder.mutation({
            query: (data: CreateTipSchemaType) => ({
                url: `/tips`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tips"],
        }),
        sendTestTip: builder.mutation({
            query: (data: CreateTipSchemaType) => ({
                url: `/tips/send-test`,
                method: "POST",
                body: data,
            }),
        }),
        editTips: builder.mutation({
            query: ({ id, content }: { id: string; content: string }) => ({
                url: `/tips/${id}`,
                method: "PUT",
                body: { content },
            }),
            invalidatesTags: ["Tips"],
        }),
        deleteTip: builder.mutation({
            query: (id: string) => ({
                url: `/tips/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tips"],
        }),

        // Tip Categories endpoints
        getTipCategories: builder.query<TipCategory[], void>({
            query: () => `/tips/categories`,
            providesTags: ['TipCategories'],
        }),
        getTipCategory: builder.query<TipCategory, string>({
            query: (id) => `/tips/categories/${id}`,
            providesTags: (result, error, id) => [{ type: 'TipCategories', id }],
        }),
        createTipCategory: builder.mutation<TipCategory, CreateTipCategorySchemaType>({
            query: (data) => ({
                url: `/tips/categories`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['TipCategories'],
        }),
        updateTipCategory: builder.mutation<TipCategory, { id: string; data: CreateTipCategorySchemaType }>({
            query: ({ id, data }) => ({
                url: `/tips/categories/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'TipCategories', id }],
        }),
        deleteTipCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/tips/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['TipCategories'],
        }),
    }),
});

export const {
    // Blog Category exports
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
    
    // Tips exports
    useCreateTipsMutation,
    useSendTestTipMutation,
    useEditTipsMutation,
    useDeleteTipMutation,
    useGetallTipsQuery,
    useGetTipByIdQuery,
    
    // Tip Categories exports
    useGetTipCategoriesQuery,
    useGetTipCategoryQuery,
    useCreateTipCategoryMutation,
    useUpdateTipCategoryMutation,
    useDeleteTipCategoryMutation,
} = blogsApi;