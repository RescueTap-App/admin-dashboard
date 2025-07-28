"use client"

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { SignInFormDataType, signInSchema } from "@/constants/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function SignInPage() {

  const { login, logingIn } = useAuth()
  const form = useForm<SignInFormDataType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = (data: SignInFormDataType) => {
    login(data)
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
              <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
              <p className="text-gray-600">Welcome Back! Log in to your account</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <ReusableFormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  fieldType="input"
                />

                <ReusableFormField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type={"password"}
                />

                <div className="flex items-center justify-between">
                  <div className={"flex items-center gap-3"}>
                    <Checkbox id={"terms"} />
                    <Label htmlFor="terms">Remember Me</Label>
                  </div>
                  <Link href={"/auth/forgot-password"}
                    className="hover:underline text-sm text-blue-600"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3 text-base font-medium rounded"
                  disabled={logingIn}
                >
                  {logingIn ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
