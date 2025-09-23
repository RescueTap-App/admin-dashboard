"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Hash, Check } from "lucide-react"

const manualEntrySchema = z.object({
    code: z
        .string()
        .min(1, "Code is required")
        .length(6, "Code must be exactly 6 digits")
        .regex(/^\d{6}$/, "Code must contain only numbers")
})

type ManualEntryForm = z.infer<typeof manualEntrySchema>

interface ManualEntryProps {
    onCodeSubmit: (code: string) => void
    isVerifying: boolean
}

function ManualEntry({ onCodeSubmit, isVerifying }: ManualEntryProps) {
    const form = useForm<ManualEntryForm>({
        resolver: zodResolver(manualEntrySchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = (data: ManualEntryForm) => {
        onCodeSubmit(data.code)
    }

    const handleInputChange = (value: string) => {
        // Only allow digits and limit to 6 characters
        const numericValue = value.replace(/\D/g, '').slice(0, 6)
        form.setValue('code', numericValue)
    }

    return (
        <div className="space-y-6">
            {/* Icon and Title */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                    <Hash className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Verify Visitor Code</h2>
                    <p className="text-gray-600">Enter QR Code to verify visitor access</p>
                </div>
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-end gap-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter 6-digit code"
                                            className="text-center text-lg font-mono tracking-widest"
                                            maxLength={6}
                                            onChange={(e) => {
                                                handleInputChange(e.target.value)
                                                field.onChange(e.target.value)
                                            }}
                                            disabled={isVerifying}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isVerifying || !form.watch('code') || form.watch('code').length !== 6}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 min-w-[100px]"
                        >
                            {isVerifying ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Verifying...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    Verify
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* Help Text */}
            <div className="text-center">
                <p className="text-sm text-gray-500">
                    Enter the 6-digit verification code provided to the visitor
                </p>
            </div>
        </div>
    )
}

export default ManualEntry
