"use client"

import { Button } from "@/components/ui/button";
import { authCodeSchema, AuthCodeFormDataType } from '@/constants/validations/auth'
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react";


export default function VerifyOtpCode() {

    const { verifyOtp, verifying, sendOtp, sendingOtp } = useAuth();
    const [countdown, setCountdown] = useState(0);
    const form = useForm<AuthCodeFormDataType>({
        resolver: zodResolver(authCodeSchema),
        defaultValues: {
            otp: ""
        },
    })

    const onSubmit = (data: AuthCodeFormDataType) => {
        verifyOtp(data)
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
                            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 flex flex-col items-center mx-auto">
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputOTP maxLength={4} {...field}>
                                                    <InputOTPGroup className='w-full flex flex-row gap-x-2'>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormMessage className="text-red-600 text-xs font-light" />
                                        </FormItem>
                                    )}
                                />
                                <p className='font-medium text-sm my-3 font-sans'>It may take a minute to receive your code.</p>
                                <Button type="submit" disabled={verifying} className='w-full rounded hover:bg-slate-900 cursor-pointer h-12 my-2'>{verifying ? "Verifying..." : "Submit"} </Button>
                                {countdown > 0 ? (
                                    <p className='font-medium text-sm font-lato md:font-sans'>
                                        You can request a new code in {countdown} seconds
                                    </p>
                                ) : (
                                    <p className='font-medium text-sm font-lato md:font-sans'>
                                        Haven&apos;t received the otp? <span
                                            className='text-blue-600 cursor-pointer hover:underline'
                                            onClick={() => {
                                                sendOtp({ phoneNumber: "" });
                                                setCountdown(60);
                                                const timer = setInterval(() => {
                                                    setCountdown((prev: number) => {
                                                        if (prev <= 1) {
                                                            clearInterval(timer);
                                                            return 0;
                                                        }
                                                        return prev - 1;
                                                    });
                                                }, 1000);
                                            }}
                                        >
                                            {sendingOtp ? "Resending..." : "Resend a new otp"}
                                        </span>
                                    </p>
                                )}
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
