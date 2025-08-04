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
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2 font-lato">Register New Vehicle</h1>
                    <p className="text-gray-600">Add a new vehicle to your organization&apos;s registry</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Owner&apos;s Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <ReusableFormField
                                        control={form.control}
                                        name={"firstName"}
                                        label=""
                                        placeholder="John doe"
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name={"lastName"}
                                        label=""
                                        placeholder="John doe"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ReusableFormField
                                        control={form.control}
                                        name={"email"}
                                        label=""
                                        type="email"
                                        placeholder="johndoe@gmail.com"
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name={"phoneNumber"}
                                        label=""
                                        type="number"
                                        placeholder="+123 9033229944"
                                    />
                                </div>

                                <ReusableFormField
                                    control={form.control}
                                    name={"residentialAddress"}
                                    label="Residential Address *"
                                    type="text"
                                    fieldType="textarea"
                                    placeholder="Enter residential address"
                                    className="min-h-20"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Vehicle Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                            </CardContent>
                        </Card>

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? "Registering..." : "Register Vehicle"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
