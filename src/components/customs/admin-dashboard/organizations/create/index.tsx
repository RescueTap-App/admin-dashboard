"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form} from "@/components/ui/form";
import { createOrganizationSchema, createOrganizationSchemaType } from "@/constants/validations/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { useFieldArray, useForm } from "react-hook-form";


function CreateOrganization() {
    const form = useForm<createOrganizationSchemaType>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            organizationName: "",
            noOfUnits: "",
            category: "",
            address: "",
            contactPerson: [
                {
                    firstName: "",
                    lastName: "",
                    contactEmail: "",
                    contactPhone: ""
                }
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "contactPerson"
    });

    const handleSubmit = (data: createOrganizationSchemaType) => {
        console.log(data);
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
                                placeholder="Enter Estate name"
                            />

                            <ReusableFormField
                                control={form.control}
                                name="noOfUnits"
                                label="Number of Units *"
                                type="number"
                                placeholder="Total units"
                            />

                            <div className={"col-span-full w-full flex flex-col gap-2"}>
                                <ReusableFormField
                                    control={form.control}
                                    name="category"
                                    label="Select Category *"
                                    fieldType="select"
                                    options={[
                                        { label: "Residential", value: "residential" },
                                        { label: "Commercial", value: "commercial" },
                                    ]}
                                    placeholder="Select a category"
                                />
                                <ReusableFormField
                                    control={form.control}
                                    name="address"
                                    label="Address *"
                                    placeholder="Enter full address"
                                    type="text"
                                    fieldType="textarea"
                                    className={"min-h-24 rounded"}
                                />
                            </div>
                        </div>

                        {/* Contact Persons */}
                        <div className="space-y-3 border sm:p-4 p-2 rounded-md">
                            <div className="flex justify-between items-center font-lato">
                                <h1 className="text-md font-semibold">Organization Contact Person’s Details</h1>
                            </div>

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3  relative"
                                >
                                    <ReusableFormField
                                        control={form.control}
                                        name={`contactPerson.${index}.firstName`}
                                        label="Address *"
                                        placeholder="Enter first name"
                                        type="text"
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name={`contactPerson.${index}.lastName`}
                                        label="Address *"
                                        placeholder="Enter last name"
                                        type="text"
                                    />
                                    <ReusableFormField
                                        control={form.control}
                                        name={`contactPerson.${index}.contactEmail`}
                                        label="Contact Email"
                                        placeholder="contact@estate.com"
                                        type="email"
                                    />

                                    <ReusableFormField
                                        control={form.control}
                                        name={`contactPerson.${index}.contactPhone`}
                                        label="Contact Phone"
                                        placeholder="+234 xxx xxx xxxx"
                                        type="number"
                                    />

                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 text-red-600"
                                            onClick={() => remove(index)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    append({ firstName: "", lastName: "", contactEmail: "", contactPhone: "" })
                                }
                            >
                                Add Another Contact <IconPlus />
                            </Button>
                        </div>

                        <div className={"flex flex-row items-center justify-end"}>
                            <Button type="submit" className="max-w-fit rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white">
                                Create New Account
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default CreateOrganization;
