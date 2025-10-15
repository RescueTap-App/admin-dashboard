"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SlotRequestFormData, slotRequestSchema } from "@/constants/validations/register-vehicle";
import useOrganization from "@/hooks/use-organization";
import useUsers from "@/hooks/use-users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Resolver, useForm } from "react-hook-form";


const urgencyOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
]

export default function RequestSlotsDetails() {
    const { id } = useParams();
    const { userById, activeSubscription } = useUsers({ userId: id as string, fetchAllUsers: true });
    const { requestSlots, requesting } = useOrganization({ orgId: id as string, fetchAllOrgs: true });

    const form = useForm<SlotRequestFormData>({
        resolver: zodResolver(slotRequestSchema) as Resolver<SlotRequestFormData>,
        defaultValues: {
            additionalUserSlots: 0,
            additionalDriverSlots: 0,
            organizationId: userById?._id || "",
            subscriptionId: activeSubscription?.subscriptionId || "",
            requesterName: "",
            urgency: "medium",
            justification: "",
        },
    })

    const handleSubmit = (data: SlotRequestFormData) => {
        requestSlots(data)
        form.reset()
    }

    return (
        <Card className="rounded shadow max-w-4xl">
            <CardHeader>
                <CardTitle className="text-xl">Request Additional Vehicle Slots</CardTitle>
                <p className="text-gray-600">
                    Submit a request to RescueTap admin for additional vehicle slots for your organization.
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReusableFormField
                                control={form.control}
                                name="additionalUserSlots"
                                label="Number of Additional User Slots Needed *"
                                placeholder="Enter number of slots"
                            />
                            <ReusableFormField
                                control={form.control}
                                name="additionalDriverSlots"
                                label="Number of Additional Driver Slots Needed *"
                                placeholder="Enter number of driver slots"
                            />

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReusableFormField
                                control={form.control}
                                name="requesterName"
                                type="text"
                                label="Requester Name *"
                                placeholder="Enter Requester Name"
                            />
                            <ReusableFormField
                                control={form.control}
                                name="urgency"
                                fieldType="select"
                                label="Request Urgency *"
                                placeholder="Select urgency level"
                                options={urgencyOptions}
                            />
                        </div>
                        <ReusableFormField
                            control={form.control}
                            name="justification"
                            fieldType="textarea"
                            label="Justification for Additional User and Driver Slots *"
                            placeholder="Please explain why you need additional vehicle slots..."
                            className="min-h-32 resize-none"
                        />

                        <div className="flex gap-3 pt-4 items-center justify-end">
                            <Button type="button" variant="outline" onClick={() => { }} className={"rounded border border-[#EF4136]"}>
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                className="flex-1 bg-[#EF4136] hover:bg-[#EF4136]/50 max-w-fit rounded"
                                disabled={requesting}
                            >
                                {requesting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
