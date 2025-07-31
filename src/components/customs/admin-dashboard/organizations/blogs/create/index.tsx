"use client"

// import RichTextEditor from "@/components/shared/editor"
import { UploadField } from "@/components/shared/file-uploader-extend"
import { ReusableFormField } from "@/components/shared/forms/form-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { CreateBlogFormData, createBlogSchema } from "@/constants/validations/blogs"
import useBlogs from "@/hooks/use-blogs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import Select from "react-select"


export default function CreateBlogs() {
    const { createBlog, creatingBlog, all_categories } = useBlogs({ fetchAllCategories: true })
    const router = useRouter()

    const form = useForm<CreateBlogFormData>({
        resolver: zodResolver(createBlogSchema),
        defaultValues: {
            title: "",
            content: "",
            author: "",
            categories: [],
            featureImage: "",
        },
    })

    const handleSubmit = async (data: CreateBlogFormData) => {
        const res = await createBlog(data)
        if (res) {
            form.reset()
            router.push("/dashboard/blogs")
        }
    }

    const categoryOptions = all_categories?.map((cat: { name: string; _id: string }) => ({
        label: cat.name,
        value: cat._id,
    })) ?? []

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Create New Blog</h1>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <Card className="rounded shadow">
                            <CardContent>
                                <div className="gap-6">
                                    <div className="grid grid-cols-3 space-y-4 gap-6">
                                        <div className="md:col-span-2 flex flex-col gap-3">
                                            <ReusableFormField control={form.control} name="title" label="Blog Title *" placeholder="e.g. How to start a startup" />
                                            <ReusableFormField control={form.control} name="author" label="Author Name *" placeholder="John Doe" />
                                            <div className={"mb-3"}>
                                                <label className="block text-sm font-medium mb-1">Categories *</label>
                                                <Controller
                                                    name="categories"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            isMulti
                                                            options={categoryOptions}
                                                            value={categoryOptions?.filter((opt: { value: string }) => field.value.includes(opt.value))}
                                                            onChange={(selected) => field.onChange(selected.map(item => item.value))}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {/* Blog Content */}
                                            {/* <div>
                                                <Controller
                                                    name="content"
                                                    control={form.control}
                                                    defaultValue=""
                                                    rules={{ required: "Content is required" }}
                                                    render={({ field }) => (
                                                        <RichTextEditor
                                                            {...field}
                                                            onChange={field.onChange}
                                                            value={field.value}
                                                        />
                                                    )}
                                                />
                                            </div> */}
                                        </div>

                                        <div>
                                            <UploadField
                                                control={form.control}
                                                name="featureImage"
                                                label="Feature Image *"
                                                buttonLabel="Upload Blog Photo"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <CardFooter className="flex flex-row justify-end">
                            <Button
                                type="submit"
                                className="max-w-md rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3"
                                disabled={creatingBlog}
                            >
                                {creatingBlog ? "Processing..." : "Create Blog"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </div>
        </div>
    )
}

