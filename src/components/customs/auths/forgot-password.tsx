"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ForgotPasswordDataType, forgotPasswordSchema } from "@/constants/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function ForgotPassword() {

    const form = useForm<ForgotPasswordDataType>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            phoneNumber: ""
        },
    })

    const handleSubmit = (data: ForgotPasswordDataType) => {
        console.log(data)
    }


    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Logo */}
            <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center">
                <Image src={"/icons/logo.svg"} alt="Rescue Tap Logo" height={300} width={300}  className="" />
            </div>

            {/* Right Side - Sign In Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
                            <p className="text-gray-600">Welcome Back! Log in to your account</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                <ReusableFormField
                                    control={form.control}
                                    name="phoneNumber"
                                    label="Phone Number"
                                    placeholder="Enter your phone Number"
                                    type="number"
                                    inputMode="numeric"
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3 text-base font-medium rounded"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? "Sending" : "Send Reset OTP"}
                                </Button>

                                    <div className="flex items-center justify-between">
                                     <span>Back to /</span>
                                    <Link href={"/auth/signup"}
                                    className={"text-blue-600 hover:underline"}
                                    >
                                     Sign In
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
