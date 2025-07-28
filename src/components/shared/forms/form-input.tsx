"use client"

import React, { useState } from "react";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type FieldType = "input" | "textarea";

interface ReusableFormFieldProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    name: string;
    type?: "text" | "file" | "number" | "radio" | "url" | "email" | "password"
    inputMode?:"numeric" | "text";
    label?: string;
    description?: string;
    placeholder?: string;
    fieldType?: FieldType;
    className?: string;
    labelStyle?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    value?: string;
}

export function ReusableFormField({
    control,
    name,
    label,
    type,
    description,
    placeholder,
    inputMode,
    fieldType = "input",
    className = "min-w-full border border-gray-300 rounded text-sm sm:text-base p-2 2xl:h-12 h-11 font-sans focus:border-[#009ED8] placeholder:text-sm",
    labelStyle = "text-black font-roboto",
    icon,
    disabled = false,
    value
}: ReusableFormFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel className={labelStyle}>{label}</FormLabel>}
                    <FormControl>
                        <div className="relative">
                            {icon && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                                    {icon}
                                </div>
                            )}
                            {fieldType === "textarea" ? (
                                <Textarea
                                    {...field}
                                    placeholder={placeholder}
                                    className={className}
                                />
                            ) : (
                                <>
                                    <Input
                                        disabled={disabled}
                                        {...field}
                                        value={value || field.value}
                                        placeholder={placeholder}
                                        inputMode={inputMode}
                                        type={type === "password" ? (showPassword ? "text" : "password") : type}
                                        className={cn(
                                            className,
                                            icon && "pl-10",
                                            type === "password" && "pr-10",
                                            disabled && "bg-gray-100"
                                        )}
                                    />
                                    {type === "password" && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                                        >
                                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage className="text-red-600 text-xs font-light" />
                </FormItem>
            )}
        />
    );
}
