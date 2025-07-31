"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { createDriverSchema, CreateDriverFormData } from "@/constants/validations/drivers"
import { ReusableFormField } from "@/components/shared/forms/form-input"
import { UploadField } from "@/components/shared/file-uploader-extend"
import useDrivers from "@/hooks/use-drivers"
import { useRouter } from "next/navigation"

export default function CreateDriver() {
    const { createDriver, creating } = useDrivers({})
    const router = useRouter()
    const form = useForm<CreateDriverFormData>({
        resolver: zodResolver(createDriverSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            driverType: "residential",
            plateNumber: "",
            vehicleName: "",
            regNumber: "",
            vehicleModel: "",
            profileImage: "",
            vehicleImage: "",
        },
    })

    const handleSubmit = async (data: CreateDriverFormData) => {
        const res = await createDriver(data);
        if (res) {
            form.reset();
            router.push("/dasboard/drivers")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Register New Driver</h1>
                    <p className="text-gray-600">Add a new driver</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <Card className={"rounded shadow"}>
                            <CardHeader>
                                <CardTitle>Driver’s Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ReusableFormField control={form.control} name="firstName" label="First Name *" placeholder="John" />
                                            <ReusableFormField control={form.control} name="lastName" label="Last Name *" placeholder="Doe" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ReusableFormField control={form.control} name="email" label="Email Address *" type="email" placeholder="johndoe@example.com" />
                                            <ReusableFormField control={form.control} name="phoneNumber" label="Phone Number *" placeholder="2348012345678" />
                                        </div>
                                        <ReusableFormField control={form.control} name="address" label="Residential Address *" placeholder={"Drivers residentail address"} fieldType="textarea" className="min-h-20 resize-none" />
                                        <ReusableFormField
                                            control={form.control}
                                            name="driverType"
                                            label="Driver Type *"
                                            fieldType="select"
                                            options={[
                                                { label: "Residential", value: "residential" },
                                                { label: "Commercial", value: "commercial" },
                                            ]}
                                            placeholder="Select driver type"
                                        />
                                    </div>
                                    <div>
                                        <UploadField
                                            control={form.control}
                                            name="profileImage"
                                            label="Profile Image *"
                                            buttonLabel="Take Profile Photo"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={"rounded shadow"}>
                            <CardHeader>
                                <CardTitle>Vehicle Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ReusableFormField control={form.control} name="vehicleName" label="Vehicle Name *" placeholder="Toyota Corolla" />
                                            <ReusableFormField control={form.control} name="vehicleModel" label="Vehicle Model *" placeholder="2020" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ReusableFormField control={form.control} name="plateNumber" label="Plate Number *" placeholder="ABC-123-XY" />
                                            <ReusableFormField control={form.control} name="regNumber" label="Registration Number *" placeholder="REG-001" />
                                        </div>
                                    </div>
                                    <div>
                                        <UploadField
                                            control={form.control}
                                            name="vehicleImage"
                                            label="Vehicle Image *"
                                            buttonLabel="Upload Vehicle Image"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <CardFooter className={"flex flex-row justify-end"}>
                            <Button type="submit" className="max-w-md rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3" disabled={creating}>
                                {creating ? "Processing..." : "Create Driver"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </div>
        </div>
    )
}
