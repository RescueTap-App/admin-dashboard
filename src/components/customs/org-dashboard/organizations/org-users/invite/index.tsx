"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { inviteOrgSchema, InviteOrgSchamaFormData } from "@/constants/validations/organization"
import { ReusableFormField } from "@/components/shared/forms/form-input"
import useOrganization from "@/hooks/use-organization"
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { countryCodes } from "@/constants/country-codes";
import { PhoneInput } from "@/components/shared/forms/phone-input"


export default function InviteOrgUser() {

    const { inviteOrgUser, inviting, } = useOrganization({})
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0])
    const { user } = useSelector((state: RootState) => state.auth);
    const inviterId = user?._id as string;

    const form = useForm<InviteOrgSchamaFormData>({
        resolver: zodResolver(inviteOrgSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
        },
    })

    const handleSubmit = async (data: InviteOrgSchamaFormData) => {
        // Combine country code with phone number
        let cleanPhoneNumber = data.phoneNumber;
        if (cleanPhoneNumber.startsWith('0')) {
            cleanPhoneNumber = cleanPhoneNumber.substring(1);
        }
        const fullPhoneNumber = selectedCountryCode.dialCode.replace('+', '') + cleanPhoneNumber
        const userData = {
            ...data,
            phoneNumber: fullPhoneNumber
        }

        const res = await inviteOrgUser(userData, inviterId);
        if (res) {
            form.reset();
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold font-lato mb-2">Invite a new user</h1>
                    <p className="text-gray-600">Fill in the details of the Organization user you intend to invite</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <Card className={"rounded shadow"}>
                            <CardHeader>
                                <CardTitle>Users’s Information</CardTitle>
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
                                            <PhoneInput
                                                control={form.control}
                                                name="phoneNumber"
                                                label="Phone Number *"
                                                placeholder="Enter phone number"
                                                onCountryChange={setSelectedCountryCode}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <CardFooter className={"flex flex-row justify-end"}>
                            <Button type="submit" className="max-w-md rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3" disabled={inviting}>
                                {inviting ? "Processing..." : "Invite User"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </div>
        </div>
    )
}
