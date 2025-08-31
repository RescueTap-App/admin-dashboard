"use client";

import React, { useState } from "react";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { countryCodes, CountryCode } from "@/constants/country-codes";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    className?: string;
    labelStyle?: string;
    disabled?: boolean;
    onCountryChange?: (country: CountryCode) => void;
}

export function PhoneInput({
    control,
    name,
    label,
    placeholder = "Enter phone number",
    className = "border border-gray-300 rounded text-sm sm:text-base p-2 2xl:h-12 h-11 font-sans focus:border-[#009ED8] placeholder:text-sm",
    labelStyle = "text-black font-roboto",
    disabled = false,
    onCountryChange,
}: PhoneInputProps) {
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]); // Default to Nigeria

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel className={labelStyle}>{label}</FormLabel>}

                    <FormControl>
                        <div className="flex gap-2 w-full items-center max-w-full">
                            {/* Country Code Select */}
                            <Select
                                value={selectedCountry.code}
                                onValueChange={(value) => {
                                    const country = countryCodes.find(c => c.code === value);
                                    if (country) {
                                        setSelectedCountry(country);
                                        onCountryChange?.(country);
                                    }
                                }}
                                disabled={disabled}
                            >
                                <SelectTrigger className={cn(
                                    "w-fit border border-gray-300 rounded text-sm sm:text-base  min-h-11  font-sans focus:border-[#009ED8]",
                                    disabled && "bg-gray-100"
                                )}>
                                    <SelectValue>
                                        <div className="flex flex-row items-center gap-1 whitespace-nowrap">
                                            <span>{selectedCountry.flag}</span>
                                            <span className="text-xs">{selectedCountry.dialCode}</span>
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {countryCodes.map((country) => (
                                        <SelectItem key={country.code} value={country.code}>
                                            <div className="flex items-center gap-2">
                                                <span>{country.flag}</span>
                                                <span>{country.name}</span>
                                                <span className="text-gray-500">({country.dialCode})</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Phone Number Input */}
                            <Input
                                {...field}
                                placeholder={placeholder}
                                className={cn(className, " max-w-full")}
                                disabled={disabled}
                                onChange={(e) => {
                                    // Remove any non-digit characters from input
                                    let cleanValue = e.target.value.replace(/\D/g, '');

                                    // Remove leading 0 if present (common in many countries)
                                    if (cleanValue.startsWith('0')) {
                                        cleanValue = cleanValue.substring(1);
                                    }

                                    field.onChange(cleanValue);
                                }}
                                value={field.value}
                            />
                        </div>
                    </FormControl>

                    <FormMessage className="text-red-600 text-xs font-light font-sans" />
                </FormItem>
            )}
        />
    );
}
