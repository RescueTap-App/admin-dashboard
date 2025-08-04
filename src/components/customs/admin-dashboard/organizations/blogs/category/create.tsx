"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CreateCategoryFormData, createCategorySchema } from "@/constants/validations/blogs"
import useBlogs from "@/hooks/use-blogs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

export default function CreateCategory() {

    const { createCategory, creatingCategory } = useBlogs({ fetchAllCategories: true });
    const form = useForm<CreateCategoryFormData>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: "",
            description: "",
            isActive: false
        },
    })

    const handleSubmit = async (data: CreateCategoryFormData) => {
        const res = await createCategory(data)
        if (res) {
            form.reset()
        }
    }

    return (
        <div className="px-2">
            <div className="mb-6 pt-2">
                <h1 className="text-2xl font-bold font-roboto mb-2 text-center">Create New Category</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <Card className="rounded shadow">
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="md:col-span-2 flex flex-col gap-3">
                                    <ReusableFormField control={form.control} name="name" label="Category Name *" placeholder="e.g. Technology" />
                                    <ReusableFormField control={form.control} name="description" label="Description *" placeholder="Short description..." />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Label htmlFor="isActive">Is Active?</Label>
                                <Controller
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <Switch
                                            id="isActive"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="max-w-full">
                            <Button
                                type="submit"
                                className="max-w-full w-full rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3"
                                disabled={creatingCategory}
                            >
                                {creatingCategory ? "Processing..." : "Create Category"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}
