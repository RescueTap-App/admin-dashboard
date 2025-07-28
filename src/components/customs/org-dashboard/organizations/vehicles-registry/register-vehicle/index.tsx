"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { vehicleRegistrationSchema, type VehicleRegistrationFormData } from "@/constants/validations/register-vehicle"
import { ReusableFormField } from "@/components/shared/forms/form-input"


export function VehicleRegistration() {
    const form = useForm<VehicleRegistrationFormData>({
        resolver: zodResolver(vehicleRegistrationSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            residentialAddress: "",
            brand: "",
            model: "",
            year: "",
            registrationNumber: "",
            color: "",
            emailAddress: "",
        },
    })

    const handleSubmit = (data: VehicleRegistrationFormData) => {
        console.log(data)
    }

    return (

        <Card className={"rounded shadow max-w-3xl 2xl:max-w-4xl"}>
            <CardContent className="space-y-4">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold font-roboto mb-2">Register New Vehicle</h1>
                    <p className="text-gray-600">Add a new vehicle to your organization&apos;s registry</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <CardHeader className={"px-0"}>
                            <CardTitle>Owner&apos;s Information</CardTitle>
                        </CardHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <ReusableFormField
                                    control={form.control}
                                    name={"firstName"}
                                    label="First Name *"
                                    placeholder="Enter first name"
                                />
                                <ReusableFormField
                                    control={form.control}
                                    name={"lastName"}
                                    label="Last Name *"
                                    placeholder="Enter last name"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ReusableFormField
                                    control={form.control}
                                    name={"email"}
                                    label="Email *"
                                    type="email"
                                    placeholder="Enter Email address"
                                />
                                <ReusableFormField
                                    control={form.control}
                                    name={"phoneNumber"}
                                    label="Phone Number *"
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="+234 xxx xxx xxxx"
                                />
                            </div>

                            <ReusableFormField
                                control={form.control}
                                name={"residentialAddress"}
                                label="Residential Address *"
                                type="text"
                                fieldType="textarea"
                                placeholder="Enter residential address"
                                className="min-h-32 rounded resize-none"
                            />
                        </div>

                        <CardHeader className={"px-0"}>
                            <CardTitle>Vehicle Information</CardTitle>
                        </CardHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReusableFormField
                                control={form.control}
                                name={"brand"}
                                label="Brand *"
                                type="text"
                                placeholder="Enter vehicle brand"
                            />
                            <ReusableFormField
                                control={form.control}
                                name={"model"}
                                label="Model *"
                                type="text"
                                placeholder="Enter vehicle model"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ReusableFormField
                                control={form.control}
                                name={"year"}
                                label="Year *"
                                type="text"
                                placeholder="Enter vehicle year"
                            />
                            <ReusableFormField
                                control={form.control}
                                name={"registrationNumber"}
                                label="Registration Number *"
                                type="number"
                                placeholder="ABC-123-XY"
                            />
                            <ReusableFormField
                                control={form.control}
                                name={"color"}
                                label="Color *"
                                type="text"
                                placeholder="Black, White, etc..."
                            />
                        </div>

                        <ReusableFormField
                            control={form.control}
                            name={"email"}
                            label="Email Address *"
                            type="email"
                            placeholder="Enter email address"
                        />

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1 bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3 rounded"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? "Registering..." : "Register Vehicle"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
