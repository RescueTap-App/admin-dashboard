"use client";

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
import { Select } from "@/components/ui/select";
import {
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

type FieldType = "input" | "textarea" | "select" | "date" | "checkbox";

interface ReusableFormFieldProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    name: string;
    type?: "text" | "file" | "number" | "radio" | "url" | "email" | "password";
    inputMode?: "numeric" | "text";
    label?: string;
    description?: string;
    placeholder?: string;
    fieldType?: FieldType;
    className?: string;
    labelStyle?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    value?: string;
    options?: { label: string; value: string }[];
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
    value,
    options = [],
}: ReusableFormFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={fieldType === "checkbox" ? "flex items-center gap-2" : ""}>
                    {fieldType !== "checkbox" && label && (
                        <FormLabel className={labelStyle}>{label}</FormLabel>
                    )}

                    <FormControl>
                        <div className="relative w-full">
                            {fieldType === "textarea" ? (
                                <Textarea {...field} placeholder={placeholder} className={className} />
                            ) : fieldType === "select" ? (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={disabled}
                                >
                                    <SelectTrigger
                                        className={cn(
                                            className,
                                            icon && "pl-10",
                                            disabled && "bg-gray-100"
                                        )}
                                    >
                                        <SelectValue placeholder={placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : fieldType === "date" ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            disabled={disabled}
                                            className={cn(
                                                className,
                                                "text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>{placeholder || "dd/mm/yyyy"}</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
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
                            ) : fieldType === "checkbox" ? (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={disabled}
                                    />
                                    <label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {label}
                                    </label>
                                </div>
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
                    <FormMessage className="text-red-600 text-xs font-light font-sans" />
                </FormItem>
            )}
        />
    );
}
