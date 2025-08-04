import { z } from "zod"

export const createBlogSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    author: z.string().min(1, "Author is required"),
    categories: z.array(z.string()).min(1, "Select at least one category"),
    featureImage: z.string().nonempty("Feature  image is required"),
})

export const createCategorySchema = z.object({
    name: z.string().min(1, "name is required"),
    description: z.string().min(1, "description is required"),
    isActive:z.boolean()
})


export type CreateBlogFormData = z.infer<typeof createBlogSchema>
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>
