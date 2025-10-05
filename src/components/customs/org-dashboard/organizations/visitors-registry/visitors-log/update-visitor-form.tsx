"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ActiveVisitorsLogTableTypes } from "@/types/visitors.types"
import { format } from "date-fns"
import { ClockIcon, CarIcon, UserIcon, FileTextIcon } from "lucide-react"
import { ReusableFormField } from "@/components/shared/forms/form-input"

// Update schema for visitor form
const updateVisitorSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    vehicleNumber: z.string().min(2, "Vehicle number must be at least 2 characters"),
    purpose: z.string().min(2, "Purpose must be at least 2 characters"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    status: z.enum(['pending', 'expired', 'checked_out', 'checked_in', 'canceled']).optional(),
})

type UpdateVisitorFormData = z.infer<typeof updateVisitorSchema>

interface UpdateVisitorFormProps {
    visitorData: ActiveVisitorsLogTableTypes
    onSubmit: (data: UpdateVisitorFormData) => Promise<void>
    onCancel: () => void
}

export function UpdateVisitorForm({ visitorData, onSubmit, onCancel }: UpdateVisitorFormProps) {
    const methods = useForm<UpdateVisitorFormData>({
        resolver: zodResolver(updateVisitorSchema),
        defaultValues: {
            name: visitorData.name,
            vehicleNumber: visitorData.vehicleNumber,
            purpose: visitorData.purpose,
            startTime: format(new Date(visitorData.startTime), "yyyy-MM-dd'T'HH:mm"),
            endTime: format(new Date(visitorData.endTime), "yyyy-MM-dd'T'HH:mm"),
            status: visitorData.status,
        },
    })

    const { handleSubmit, formState: { isSubmitting } } = methods

    const handleFormSubmit = async (data: UpdateVisitorFormData) => {
        try {
            await onSubmit(data)
        } catch (error) {
            console.error("Error updating visitor:", error)
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <Card className="shadow-none rounded">
                    <CardHeader className="pb-4 font-nunito">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <UserIcon className="h-5 w-5" />
                            Visitor Information
                        </CardTitle>
                        <CardDescription>
                            Update the visitor&apos;s personal details and visit information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Name Field */}
                        <ReusableFormField
                            control={methods.control}
                            name="name"
                            label="Visitor Name *"
                            placeholder="Enter visitor name"
                            icon={<UserIcon className="h-4 w-4 text-black" />}
                        />

                        {/* Vehicle Number Field */}
                        <ReusableFormField
                            control={methods.control}
                            name="vehicleNumber"
                            label="Vehicle Number *"
                            placeholder="Enter vehicle number"
                            icon={<CarIcon className="h-4 w-4" />}

                        />

                        {/* Purpose Field */}
                        <ReusableFormField
                            control={methods.control}
                            name="purpose"
                            label="Purpose of Visit *"
                            placeholder="Enter purpose of visit"
                            fieldType="textarea"
                            icon={<FileTextIcon className="h-4 w-4 text-muted-foreground" />}
                            className="pl-10 resize-none"
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-none rounded">
                    <CardHeader className="pb-4 font-nunito">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ClockIcon className="h-5 w-5" />
                            Visit Schedule
                        </CardTitle>
                        <CardDescription>
                            Set the expected arrival and departure times
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Time Field */}
                            <ReusableFormField
                                control={methods.control}
                                name="startTime"
                                label="Check-in Time *"
                                type="datetime-local"
                                className="transition-colors"
                            />

                            {/* End Time Field */}
                            <ReusableFormField
                                control={methods.control}
                                name="endTime"
                                label="Check-out Time *"
                                type="datetime-local"
                                className="transition-colors"
                            />

                            <div className="col-span-2">
                                <ReusableFormField
                                    control={methods.control}
                                    name="status"
                                    label="Status *"
                                    placeholder="Select status"
                                    fieldType="select"
                                    options={
                                        [
                                            { label: "Checked-in", value: "checked_in" },
                                            { label: "Checked-out", value: "checked_out" },
                                            // { label: "Expired", value: "expired" },
                                            // { label: "Canceled", value: "canceled" }
                                        ]
                                    }
                                />
                            </div>
                        </div>

                        {/* Current Status Display */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Current Status</label>
                            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                <div className={`w-2 h-2 rounded-full ${visitorData.status === 'pending' ? "bg-amber-500" :
                                    visitorData.status === 'checked_in' ? "bg-green-500" :
                                        visitorData.status === 'checked_out' ? "bg-blue-500" :
                                            visitorData.status === 'expired' ? "bg-red-500" :
                                                "bg-gray-500"
                                    }`} />
                                <span className="text-sm font-medium capitalize">
                                    {visitorData.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1 sm:flex-none"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 sm:flex-none bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3 rounded"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Visitor"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}
