"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema, CreateUserFormData } from "@/constants/validations/register-user"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReusableFormField } from "@/components/shared/forms/form-input"
import { PhoneInput } from "@/components/shared/forms/phone-input"
import { countryCodes } from "@/constants/country-codes"
import useUsers from "@/hooks/use-users"
import { useState } from "react"



export default function CreateUser() {
    const { createUser, creating } = useUsers({})
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0])

    const form = useForm<CreateUserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            verified: false,
        },
    })

    const handleSubmit = async (data: CreateUserFormData) => {
        // Clean the phone number to ensure no leading 0
        let cleanPhoneNumber = data.phoneNumber;
        if (cleanPhoneNumber.startsWith('0')) {
            cleanPhoneNumber = cleanPhoneNumber.substring(1);
        }

        // Combine country code with phone number
        const fullPhoneNumber = selectedCountryCode.dialCode.replace('+', '') + cleanPhoneNumber

        const userData = {
            ...data,
            phoneNumber: fullPhoneNumber
        }

        const res = await createUser(userData)
        if (res) {
            form.reset();
        }
        // toast.message(JSON.stringify(userData))
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2 font-lato">Create New User</h1>
                    <p className="text-gray-600">Fill in the form to create a new user</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <Card className="rounded shadow overflow-hidden">
                            <CardHeader>
                                <CardTitle className="font-lato text-xl font-bold">User Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ReusableFormField
                                        control={form.control}
                                        name="firstName"
                                        label="First Name *"
                                        placeholder="John"
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name="lastName"
                                        label="Last Name *"
                                        placeholder="Doe"
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name="email"
                                        label="Email Address *"
                                        type="email"
                                        placeholder="johndoe@example.com"
                                    />
                                    <PhoneInput
                                        control={form.control}
                                        name="phoneNumber"
                                        label="Phone Number *"
                                        placeholder="e.g., 8073952126 (without leading 0)"
                                        onCountryChange={setSelectedCountryCode}
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name="address"
                                        label="Residential Address *"
                                        placeholder="User’s address"
                                        fieldType="textarea"
                                        className="min-h-20 resize-none"
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name="verified"
                                        label="Verified?"
                                        fieldType="checkbox"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-[#EF4136] hover:bg-[#EF4136]/80 rounded text-white py-3"
                                    disabled={creating}
                                >
                                    {creating ? "Processing..." : "Create User"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>
    )
}
