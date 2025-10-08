"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input"
import { PhoneInput } from "@/components/shared/forms/phone-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { countryCodes } from "@/constants/country-codes"
import { visitorsSchema, VisitorsSchemaFormDataType } from "@/constants/validations/register-visitor"
import useVisitors from "@/hooks/use-visitors"
import { RootState } from "@/lib/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { toast } from "sonner"

// Helper function to get timezone-aware ISO string
const getLocalISOString = (date: Date): string => {
    const localISOTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -1); // remove trailing 'Z'

    const offsetMin = date.getTimezoneOffset();
    const sign = offsetMin > 0 ? "-" : "+";
    const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, "0");
    const offset = `${sign}${pad(offsetMin / -60)}:${pad(offsetMin % 60)}`;

    return `${localISOTime}${offset}`;
};


export default function InviteVisitor() {
    const { inviteVisitor, invitingVisitor } = useVisitors({})
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0])
    const { user } = useSelector((state: RootState) => state.auth);
    const tenantId = user?._id as string;
    const router = useRouter();
    const form = useForm<VisitorsSchemaFormDataType>({
        resolver: zodResolver(visitorsSchema),
        defaultValues: {
            name: "",
            purpose: "",
            phone: "",
            email: "",
            startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            endTime: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
            vehicleNumber: "",
        },
    })

    const handleSubmit = async (data: VisitorsSchemaFormDataType) => {

        let cleanPhoneNumber = data.phone;
        if (cleanPhoneNumber.startsWith('0')) {
            cleanPhoneNumber = cleanPhoneNumber.substring(1);
        }
        const fullPhoneNumber = selectedCountryCode.dialCode.replace('+', '') + cleanPhoneNumber

        // Convert datetime-local values to timezone-aware ISO strings
        const startTimeISO = getLocalISOString(new Date(data.startTime));
        const endTimeISO = getLocalISOString(new Date(data.endTime));

        const userData = {
            ...data,
            phone: fullPhoneNumber,
            startTime: startTimeISO,
            endTime: endTimeISO
        }
        console.log(userData)
        toast.message(JSON.stringify(userData))
        const res = await inviteVisitor(userData, tenantId);
        if (res) {
            form.reset();
            router.push("/org/visitors");
        }
    }

    return (
        <section>
            <Card className={"rounded shadow max-w-4xl 2xl:max-w-4xl"}>
                <CardContent className="space-y-4">
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold font-roboto mb-2">Generate Visitor Pass</h1>
                        <p className="text-gray-600">Create a temporary tag pass for a visitor</p>
                    </div>
                    <div className={"border border-[#5283EB] bg-[#5283EB]/20 rounded-sm p-2"}>
                        <h1 className={"text-[#063776] font-semibold font-roboto"}>Visitor Tag Number: BH-0007</h1>
                        <p className={"text-[#00499A]"}>This unique identifier will be used to track the visitor in the system</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <CardHeader className={"px-0"}>
                                <CardTitle>Visitors&apos;s Information</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ReusableFormField
                                        control={form.control}
                                        name={"name"}
                                        label="Name *"
                                        placeholder="Enter name"
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name={"email"}
                                        label="Email *"
                                        type="email"
                                        placeholder="Enter email"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <PhoneInput
                                        control={form.control}
                                        name="phone"
                                        label="Phone Number *"
                                        placeholder="Enter phone number"
                                        onCountryChange={setSelectedCountryCode}
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name={"vehicleNumber"}
                                        label="Vehicle Plate Number"
                                        type="text"
                                        placeholder="ABC-123-xy"
                                    />
                                </div>
                            </div>

                            <CardHeader className={"px-0"}>
                                <CardTitle>Check-in  Information</CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
                                <ReusableFormField
                                    control={form.control}
                                    name="startTime"
                                    label="Check-in Time *"
                                    type="datetime-local"
                                // className="transition-colors h-10"
                                />

                                {/* End Time Field */}
                                <ReusableFormField
                                    control={form.control}
                                    name="endTime"
                                    label="Check-out Time *"
                                    type="datetime-local"
                                // className="transition-colors"
                                />
                            </div>


                            <div className="grid grid-cols-1 gap-4 w-full">
                                <div className={"flex flex-col col-span-2 w-full"}>
                                    <ReusableFormField
                                        control={form.control}
                                        name={"purpose"}
                                        label="Purpose of Visit"
                                        type="text"
                                        fieldType="textarea"
                                        placeholder="Enter purpose of visit"
                                        className="min-h-32 rounded resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-[#EF4136] h-11 hover:bg-[#EF4136]/50 text-white py-3 rounded"
                                    disabled={form.formState.isSubmitting || invitingVisitor}
                                >
                                    {form.formState.isSubmitting ? "Generating..." : "Generate Pass"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    )
}
