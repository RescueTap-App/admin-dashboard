"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { visitorsSchema, VisitorsSchemaFormDataType } from "@/constants/validations/register-visitor"
import { ReusableFormField } from "@/components/shared/forms/form-input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"


export default function GenerateVisitorsPass() {

    const form = useForm<VisitorsSchemaFormDataType>({
        resolver: zodResolver(visitorsSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            purposeOfVisit: "",
            phoneNumber: "",
            hostName: "",
            hostPhone: "",
            date: new Date(),
            time: "",
            vehiclePlateNumber: "",
            notes: "",
        },
    })

    const handleSubmit = (data: VisitorsSchemaFormDataType) => {
        console.log(data)
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
                                        name={"purposeOfVisit"}
                                        label="Purpose of Visit *"
                                        type="text"
                                        placeholder="Enter purpose of visit"
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



                            </div>

                            <CardHeader className={"px-0"}>
                                <CardTitle>Host Information</CardTitle>
                            </CardHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ReusableFormField
                                    control={form.control}
                                    name={"hostName"}
                                    label="Host Name *"
                                    type="text"
                                    placeholder="Person being Visited"
                                />
                                <ReusableFormField
                                    control={form.control}
                                    name={"hostPhone"}
                                    label="Host Phone *"
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="Enter Host phone"
                                />
                            </div>


                            <CardHeader className={"px-0"}>
                                <CardTitle>Check-in  Information</CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className={"text-black font-roboto"}>Date *</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal rounded border border-gray-300 p-2 2xl:h-12 h-11",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>dd/mm/yyy</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <ReusableFormField
                                    control={form.control}
                                    name={"time"}
                                    label="Time *"
                                    type="text"
                                    placeholder="Will be generated automatically"
                                />

                            </div>


                            <div className="grid grid-cols-1 gap-4 w-full">
                                <ReusableFormField
                                    control={form.control}
                                    name={"vehiclePlateNumber"}
                                    label="Vehicle Plate Number (Optional)"
                                    type="text"
                                    placeholder="ABC-123-xy"
                                />

                                <div className={"flex flex-col col-span-2 w-full"}>
                                    <ReusableFormField
                                        control={form.control}
                                        name={"notes"}
                                        label="Additiobal Notes (Optional)"
                                        type="text"
                                        fieldType="textarea"
                                        placeholder="Any Specific Instructions or Notes "
                                        className="min-h-32 rounded resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3 rounded"
                                    disabled={form.formState.isSubmitting}
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
