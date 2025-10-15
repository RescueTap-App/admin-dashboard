"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlotRequestFormData, slotRequestSchema } from "@/constants/validations/register-vehicle"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


const urgencyOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
]

export function RequestSlots() {

    const form = useForm<SlotRequestFormData>({
        resolver: zodResolver(slotRequestSchema),
        defaultValues: {
            additionalUserSlots: 0,
            additionalDriverSlots: 0,
            organizationId: "",
            subscriptionId: "",
            requesterName: "",
            urgency: "medium",
            justification: "",
        },
    })

    const handleSubmit = (data: SlotRequestFormData) => {
        console.log(data)
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
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ReusableFormField
                                    control={form.control}
                                    name="numberOfSlots"
                                    label="Number of Additional Slots Needed *"
                                    type="number"
                                    placeholder="Enter number of slots"
                                />
                                <ReusableFormField
                                    control={form.control}
                                    name="requesterName"
                                    type="text"
                                    label="Requester Name *"
                                    placeholder="Enter Requester Name"
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="urgency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Request Urgency *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={"w-full rounded h-12 py-2"}>
                                                <SelectValue placeholder="Select urgency level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {urgencyOptions.map((op) => (
                                                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ReusableFormField
                            control={form.control}
                            name="justification"
                            type="text"
                            fieldType="textarea"
                            label="Justification for Additional Slots *"
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
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? "Submitting..." : "Submit Request"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
