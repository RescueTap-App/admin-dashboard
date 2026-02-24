import type { 
  CreateCategoryFormData,
  CreateTipSchemaType
} from "@/constants/validations/blogs";
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
    useUpdateCategoryMutation,
    useCreateTipsMutation,
    useEditTipsMutation,
    useDeleteTipMutation,
    useGetallTipsQuery,
    useSendTestTipMutation
} from "@/redux/features/blogs-api";
import { BlogDataTypes } from "@/types/blogs.types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface BlogProps {
    fetchAllBlogs?: boolean;
    fetchABlog?: boolean;
    blogId?: string;
    fetchAllCategories?: boolean;
    fetchAllTips?: boolean;
    fetchACategory?: boolean;
    categoryId?: string;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const err = error as FetchBaseQueryError;

    if (typeof err.data === "object" && err.data && "message" in err.data) {
      return (err.data as { message: string }).message;
    }
  }

  return "Something went wrong";
}
export default function useBlogs({
    fetchAllBlogs,
    fetchABlog,
    blogId,
    fetchAllCategories,
    fetchACategory,
    fetchAllTips,
    categoryId
}: BlogProps) {
    const router = useRouter();
    const [createBlogMutation, { isLoading: creatingBlog }] = useCreateBlogMutation();
    const [updateBlogMutation, { isLoading: updatingBlog }] = useUpdateBlogMutation();
    const [deleteBlogMutation, { isLoading: deletingBlog }] = useDeleteBlogMutation();
    const [createTipMutation, { isLoading: creatingTip }] = useCreateTipsMutation();
    const [editTipMutation, { isLoading: editingTips }] = useEditTipsMutation();
    const [deleteTipMutation, { isLoading: deletingTips }] = useDeleteTipMutation();
    const [sendTestTipMutation, { isLoading: sendingTestTip }] = useSendTestTipMutation();
    const [createCategoryMutation, { isLoading: creatingCategory }] = useCreateCategoryMutation();
    const [updateCategoryMutation, { isLoading: updatingCategory }] = useUpdateCategoryMutation();
    const [deleteCategoryMutation, { isLoading: deletingCategory }] = useDeleteCategoryMutation();

    const { data: tips, isLoading: loadingtips } = useGetallTipsQuery(undefined, {
        skip: !fetchAllTips,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

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
            toast.success("Blog updated successfully");
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
            toast.success("Blog deleted successfully");
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
const createTips = async (data: CreateTipSchemaType) => {
    try {
      const res = await createTipMutation(data).unwrap();
      toast.success("Tip created successfully");
      return res;
   } catch (error: unknown) {
  toast.error(getErrorMessage(error));
}
  };

  const sendTestTip = async (data: CreateTipSchemaType) => {
    try {
      const res = await sendTestTipMutation(data).unwrap();
      toast.success("Test tip sent successfully");
      return res;
  } catch (error: unknown) {
  toast.error(getErrorMessage(error));
}
  };

  const updateTips = async (id: string, content: string) => {
    try {
      const res = await editTipMutation({ id, content }).unwrap();
      toast.success("Tip updated successfully");
      return res;
  } catch (error: unknown) {
  toast.error(getErrorMessage(error));
}
  };

  const deleteTips = async (id: string) => {
    try {
      const res = await deleteTipMutation(id).unwrap();
      toast.success("Tip deleted successfully");
      return res;
   } catch (error: unknown) {
  toast.error(getErrorMessage(error));
}
  };

    return {
        createTips,
        creatingTip,
        deleteTips,
        deletingTips,
        updateTips,
        editingTips,
        sendTestTip,
        sendingTestTip,
        tips,
        loadingtips,
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
