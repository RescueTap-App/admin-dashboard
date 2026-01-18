"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { createTipSchema, createTipSchemaType } from "@/constants/validations/blogs";
import useBlogs from "@/hooks/use-blogs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


function CreateTips() {

    const { createTips, creatingTip, sendTestTip, sendingTestTip } = useBlogs({})
    const form = useForm<createTipSchemaType>({
        resolver: zodResolver(createTipSchema),
        defaultValues: {
            content: "",
        }
    });

    const handleSubmit = async (data: createTipSchemaType) => {
        const { content } = data
        const res = await createTips(content)
        if (res) {
            form.reset()
        };
    }

    const handleSendTestTip = async (data: createTipSchemaType) => {
        const { content } = data
        const res = await sendTestTip(content)
        if (res) {
            form.reset()
        };
    }

    return (
        <div className={"grid grid-cols-1 lg:grid-cols-2 gap-4"}>
            <Card className="rounded shadow max-w-4xl mx-auto w-full">
                <CardHeader>
                    <CardTitle>Create Automated Tips</CardTitle>
                    <CardDescription>Create a new tip in the RescueTap system that is posted 7am and 4pm</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <ReusableFormField
                                control={form.control}
                                name="content"
                                fieldType="textarea"
                                className="h-20 text-sm rounded"
                                placeholder="Stay hydrated and rest well"
                            />
                            <CardFooter className={"flex flex-row justify-end"}>
                                <Button
                                    disabled={creatingTip}
                                    type="submit" className="max-w-md rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3" >
                                    {creatingTip ? "Processing..." : " Create Tip"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="rounded shadow max-w-4xl mx-auto w-full">
                <CardHeader>
                    <CardTitle>Create New Test Tips</CardTitle>
                    <CardDescription>
                        Send a test tip to the RescueTap system
                        This automatically sends a tip to all organizations and users and be displayed in their notifications
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSendTestTip)} className="space-y-6">
                            <ReusableFormField
                                control={form.control}
                                name="content"
                                fieldType="textarea"
                                className="h-20 text-sm rounded"
                                placeholder="Enter the content of the tip"
                            />
                            <CardFooter className={"flex flex-row justify-end"}>
                                <Button
                                    disabled={sendingTestTip}
                                    type="submit" className="max-w-md rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3" >
                                    {sendingTestTip ? "Processing..." : " Send Test Tip"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateTips
