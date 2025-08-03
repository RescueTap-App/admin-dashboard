"use client"

import { UploadField } from "@/components/shared/file-uploader-extend"
import { ReusableFormField } from "@/components/shared/forms/form-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { UpdateDriverFormData, updateDriverSchema } from "@/constants/validations/drivers"
import useDrivers from "@/hooks/use-drivers"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

interface UpdateProps {
    driverId: string
}

export default function UpdateDriver({ driverId }: UpdateProps) {
    const { updateDriver, updating, driver } = useDrivers({ fetchADriver: true, driverId });

    const form = useForm<UpdateDriverFormData>({
        resolver: zodResolver(updateDriverSchema),
        defaultValues: {
            driverName: "",
            emailAddress: "",
            homeAddress: "",
            licenseNumber: "",
            vehicle: "",
            vehicleMake: "",
            vehicleModel: "",
            vehicleType: "",
            emergencyContactName: "",
            insuranceInformation: "",
            profilePicture: "",
            image: "",
            password: "",
        },
    });

    useEffect(() => {
        if (driver) {
            form.reset({
                driverName: driver.driverName || "",
                emailAddress: driver.emailAddress || "",
                homeAddress: driver.homeAddress || "",
                licenseNumber: driver.licenseNumber || "",
                vehicle: driver.vehicle || "",
                vehicleMake: driver.vehicleMake || "",
                vehicleModel: driver.vehicleModel || "",
                vehicleType: driver.vehicleType || "",
                emergencyContactName: driver.emergencyContactName || "",
                insuranceInformation: driver.insuranceInformation || "",
                profilePicture: driver.profilePicture || "",
                image: driver.image || "",
                password: "",
            });
        }
    }, [driver, form]);

    const handleSubmit = async (data: UpdateDriverFormData) => {
        const res = await updateDriver(data);
        if (res) {
            form.reset();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Update this Driver</h1>
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
                                        <ReusableFormField control={form.control} name="driverName" label="Driver Name" placeholder="John Doe" />
                                        <ReusableFormField control={form.control} name="emailAddress" label="Email Address" placeholder="johndoe@example.com" type="email" />
                                        <ReusableFormField control={form.control} name="homeAddress" label="Residential Address" placeholder="123 Main Street" fieldType="textarea" />
                                        <ReusableFormField control={form.control} name="licenseNumber" label="License Number" placeholder="D1234567890" />
                                        <ReusableFormField control={form.control} name="emergencyContactName" label="Emergency Contact Name" placeholder="Jane Doe" />
                                        <ReusableFormField control={form.control} name="insuranceInformation" label="Insurance Information" placeholder="Policy 1234ABC" />
                                        <ReusableFormField control={form.control} name="password" label="Password" type="password" placeholder="Update password (optional)" />
                                    </div>
                                    <div>
                                        <UploadField
                                            control={form.control}
                                            name="profilePicture"
                                            label="Profile Picture"
                                            buttonLabel="Upload"
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
                                        <ReusableFormField control={form.control} name="vehicle" label="Vehicle Name" placeholder="Toyota Corolla" />
                                        <ReusableFormField control={form.control} name="vehicleMake" label="Vehicle Make" placeholder="Toyota" />
                                        <ReusableFormField control={form.control} name="vehicleModel" label="Vehicle Model" placeholder="2020" />
                                        <ReusableFormField control={form.control} name="vehicleType" label="Vehicle Type" placeholder="Sedan" />
                                    </div>
                                    <div>
                                        <UploadField
                                            control={form.control}
                                            name="image"
                                            label="Vehicle Image"
                                            buttonLabel="Upload Vehicle Image"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <CardFooter className={"flex flex-row justify-end"}>
                            <Button type="submit" className="max-w-md rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3" disabled={updating}>
                                {updating ? "Processing..." : "Update"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </div>
        </div>
    );
}
