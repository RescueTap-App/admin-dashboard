import { CreateCategoryFormData } from "@/constants/validations/blogs";
import {
    useCreateBlogMutation,
    useCreateCategoryMutation,
    useDeleteBlogMutation,
    useDeleteCategoryMutation,
    useGetaBlogQuery,
    useGetaCategoryQuery,
    useGetallBlogsQuery,
    useGetallCategoryQuery,
    useUpdateBlogMutation,
    useUpdateCategoryMutation
} from "@/redux/features/blogs-api";
import { BlogDataTypes } from "@/types/blogs.types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BlogProps {
    fetchAllBlogs?: boolean;
    fetchABlog?: boolean;
    blogId?: string;
    fetchAllCategories?: boolean;
    fetchACategory?: boolean;
    categoryId?: string;
}

export default function useBlogs({
    fetchAllBlogs,
    fetchABlog,
    blogId,
    fetchAllCategories,
    fetchACategory,
    categoryId
}: BlogProps) {
    const router = useRouter();
    const [createBlogMutation, { isLoading: creatingBlog }] = useCreateBlogMutation();
    const [updateBlogMutation, { isLoading: updatingBlog }] = useUpdateBlogMutation();
    const [deleteBlogMutation, { isLoading: deletingBlog }] = useDeleteBlogMutation();

    const [createCategoryMutation, { isLoading: creatingCategory }] = useCreateCategoryMutation();
    const [updateCategoryMutation, { isLoading: updatingCategory }] = useUpdateCategoryMutation();
    const [deleteCategoryMutation, { isLoading: deletingCategory }] = useDeleteCategoryMutation();

    const { data: all_blogs, isLoading: loadingBlogs } = useGetallBlogsQuery(undefined, {
        skip: !fetchAllBlogs,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const { data: blog, isLoading: loadingBlog } = useGetaBlogQuery(blogId!, {
        skip: !fetchABlog || !blogId,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const { data: all_categories, isLoading: loadingCategories } = useGetallCategoryQuery(undefined, {
        skip: !fetchAllCategories,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const { data: category, isLoading: loadingCategory } = useGetaCategoryQuery(categoryId!, {
        skip: !fetchACategory || !categoryId,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const createBlog = async (data: BlogDataTypes) => {
        try {
            const res = await createBlogMutation({ data }).unwrap();
            if (res) {
                toast.success("Blog created successfully");
                setTimeout(() => {
                    router.push("/dashboard/blogs");
                }, 1000);
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to create blog"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const updateBlog = async (data: BlogDataTypes) => {
        try {
            const res = await updateBlogMutation({ id: blogId, data }).unwrap();
            if (res) {
                toast.success("Blog updated successfully");
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to update blog"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const deleteBlog = async (id: string) => {
        try {
            const res = await deleteBlogMutation({ id }).unwrap();
            if (res) {
                toast.success("Blog deleted successfully");
            }
            return res
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to delete blog"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const createCategory = async (data: CreateCategoryFormData) => {
        try {
            const res = await createCategoryMutation({ data }).unwrap();
            if (res) {
                toast.success("Category created successfully");
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to create category"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const updateCategory = async (data: CreateCategoryFormData,) => {
        try {
            const res = await updateCategoryMutation({ id: categoryId, data }).unwrap();
            if (res) {
                toast.success("Category updated successfully");
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to update category"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const res = await deleteCategoryMutation({ id }).unwrap();
            if (res) {
                toast.success("Category deleted successfully");
            }
            return res
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to delete category"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    return {
        // Blogs
        all_blogs,
        loadingBlogs,
        blog,
        loadingBlog,
        createBlog,
        creatingBlog,
        updateBlog,
        updatingBlog,
        deleteBlog,
        deletingBlog,

        // Categories
        all_categories,
        loadingCategories,
        category,
        loadingCategory,
        createCategory,
        creatingCategory,
        updateCategory,
        updatingCategory,
        deleteCategory,
        deletingCategory
    };
}
