"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { PhoneInput } from "@/components/shared/forms/phone-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { countryCodes } from "@/constants/country-codes";
import { createOrganizationSchema, createOrganizationSchemaType } from "@/constants/validations/organization";
import useOrganization from "@/hooks/use-organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

function CreateOrganization() {
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0])
    const { createOrganization, creating } = useOrganization({});
    const form = useForm<createOrganizationSchemaType>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            organizationName: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
            subscriptionPlan: "monthly",
            driverLimit: 1,
            userLimit: 1,
            amount: 1
        }
    });

    const handleSubmit = (data: createOrganizationSchemaType) => {
        // Combine country code with phone number
        let cleanPhoneNumber = data.phoneNumber;
        if (cleanPhoneNumber.startsWith('0')) {
            cleanPhoneNumber = cleanPhoneNumber.substring(1);
        }
        const fullPhoneNumber = selectedCountryCode.dialCode.replace('+', '') + cleanPhoneNumber

        const organizationData = {
            ...data,
            phoneNumber: fullPhoneNumber
        }
        createOrganization(organizationData)
    };

    return (
        <Card className="rounded shadow max-w-4xl w-full">
            <CardHeader>
                <CardTitle>Add New Organization</CardTitle>
                <CardDescription>Register a new organization in the RescueTap system</CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Organization Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded p-2 sm:p-4">
                            <ReusableFormField
                                control={form.control}
                                name="organizationName"
                                label="Organization Name *"
                                type="text"
                                placeholder="Enter organization name"
                            />

                            <ReusableFormField
                                control={form.control}
                                name="firstName"
                                label="First Name *"
                                type="text"
                                placeholder="Enter first name"
                            />

                            <ReusableFormField
                                control={form.control}
                                name="lastName"
                                label="Last Name *"
                                type="text"
                                placeholder="Enter last name"
                            />
                            <PhoneInput
                                control={form.control}
                                name="phoneNumber"
                                label="Phone Number *"
                                placeholder="Enter phone number"
                                onCountryChange={setSelectedCountryCode}
                            />

                            <ReusableFormField
                                control={form.control}
                                name="email"
                                label="Email *"
                                type="email"
                                placeholder="Enter email address"
                            />

                            <ReusableFormField
                                control={form.control}
                                name="password"
                                label="Password *"
                                type="password"
                                placeholder="Enter password"
                            />

                            <ReusableFormField
                                control={form.control}
                                name="subscriptionPlan"
                                label="Subscription Plan *"
                                fieldType="select"
                                options={[
                                    { label: "Monthly", value: "monthly" },
                                    { label: "Yearly", value: "yearly" },
                                ]}
                                placeholder="Select a plan"
                            />

                            <ReusableFormField
                                control={form.control}
                                name="driverLimit"
                                label="Driver Limit *"
                                type="number"
                                placeholder="Maximum number of drivers"
                            />

                            <ReusableFormField
                                control={form.control}
                                name="userLimit"
                                label="User Limit *"
                                type="number"
                                inputMode={"numeric"}
                                placeholder="Maximum number of users"
                            />

                            <ReusableFormField
                                control={form.control}
                                name="amount"
                                label="Amount *"
                                type="number"
                                inputMode={"numeric"}
                                placeholder="Amount (₦)"
                            />
                        </div>

                        <CardFooter className={"flex flex-row justify-end"}>
                            <Button type="submit" className="max-w-md rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3" disabled={creating}>
                                {creating ? "Processing..." : "Create Organization"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>

            </CardContent>
        </Card>
    );
}

export default CreateOrganization;
