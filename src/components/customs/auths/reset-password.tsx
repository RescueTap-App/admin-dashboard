"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ResetPasswordDataType, resetPasswordSchema } from "@/constants/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function ResetOldPassword() {

  const { resetPassword, resetting } = useAuth();
  const form = useForm<ResetPasswordDataType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    },
  })

  
  const handleSubmit = (data: ResetPasswordDataType) => {
    resetPassword(data)
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
              <h1 className="text-2xl font-bold text-gray-900">Reset Ypu password</h1>
              <p className="text-gray-600">Please Provide a new secure password for your account!</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <ReusableFormField
                  control={form.control}
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter your new password"
                  type={"password"}
                />
                  <ReusableFormField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type={"password"}
                />

                <div className="flex items-center gap-2">
                  <span>Remmbered Password?</span>
                  <Link href={"/auth/signin"}
                    className="hover:underline text-sm text-blue-600"
                  >
                   Signin
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3 text-base font-medium rounded"
                  disabled={resetting}
                >
                  {resetting ? "Applying changes..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
