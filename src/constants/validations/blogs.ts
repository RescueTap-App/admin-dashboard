import { z } from "zod"

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  featureImage: z.string().nonempty("Feature image is required"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
})

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
})

export const createTipSchema = z.object({
  content: z.string().min(1, "Content is required"),
  category: z.enum(["Safety", "Updates"]),
})

export const updateTipSchema = z.object({
  content: z.string().min(1, "Content is required"),
})

/* TYPES */
export type CreateTipSchemaType = z.infer<typeof createTipSchema>
export type UpdateTipSchemaType = z.infer<typeof updateTipSchema>
export type CreateBlogFormData = z.infer<typeof createBlogSchema>
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>