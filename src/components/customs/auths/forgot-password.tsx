"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ForgotPasswordDataType, forgotPasswordSchema } from "@/constants/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function ForgotPassword() {

    const { sendOtp, sendingOtp } = useAuth()
    const form = useForm<ForgotPasswordDataType>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            phoneNumber: ""
        },
    })

    const handleSubmit = (data: ForgotPasswordDataType) => {
        sendOtp(data)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Logo */}
            <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center">
                <Image src={"/icons/loti-auth.png"} alt="Rescue Tap Logo" height={300} width={300} className="" />
            </div>

            {/* Right Side - Sign In Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="w-full max-w-md space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
                            <p className="text-gray-600 text-sm 2xl:text-base">Please Provide your associated account Phone number to get an OTP code</p>
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
                                    className="w-full bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3 text-base rounded font-lato"
                                    disabled={sendingOtp}
                                >
                                    {sendingOtp ? "Sending" : "Send Reset OTP"}
                                </Button>

                                <div className="flex items-center">
                                    <span>Back to / </span>
                                    <Link href={"/"}
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
