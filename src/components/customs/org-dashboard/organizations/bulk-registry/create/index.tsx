"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Mail, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BsFiletypeCsv, BsUpload } from "react-icons/bs";
import { FaRegHandRock } from "react-icons/fa";
import { PiEyeThin, PiSealCheckBold } from "react-icons/pi";
import { toast } from "sonner";


export default function BulkRegistration() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type === "text/csv") {
            setSelectedFile(file);
        } else {
            toast.message("Only CSV files are allowed.");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "text/csv": [".csv"],
        },
    });

    const showSuccess = true

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 p-3">
                <div className="max-w-2xl mx-auto">
                    <Card className="mb-6 bg-[#18AB004D]/30 rounded border border-[#18AB004D]">
                        <CardContent className="sm:p-4">
                            <div className="flex items-center gap-3 mb-4 w-full">
                                <div className="w-10 h-10 bg-[#18AB00] rounded-full flex items-center justify-center">
                                    <PiSealCheckBold className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold text-[#18AB00]">Bulk Onboarding Complete</div>
                                    <div className="text-sm text-[#18AB00]">
                                        15 users have been successfully onboarded to the RescueTap app with automatic
                                        login credentials
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <Card className={"rounded font-lato"}>
                            <CardContent className="p-4 text-center">
                                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-600">30</div>
                                <div className="text-sm text-gray-600">Users Onboarded</div>
                            </CardContent>
                        </Card>

                       <Card className={"rounded font-lato"}>
                            <CardContent className="p-4 text-center">
                                <Key className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-600">50</div>
                                <div className="text-sm text-gray-600">Credentials Generated</div>
                            </CardContent>
                        </Card>

                        <Card className={"rounded font-lato"}>
                            <CardContent className="p-4 text-center">
                                <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-600">50</div>
                                <div className="text-sm text-gray-600">Login Credentials Sent</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mb-6 bg-[#5283EB]/20 border border-[#5283EB] rounded">
                        <CardHeader>
                            <CardTitle className="text-lg text-[#00499A] font-semibold">What Happens Next?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-[#00499A] rounded-full mt-2"/>
                                    <div>All users receive login credentials via email</div>
                                </div>
                                <div className="flex items-start gap-2 text-[#00499A]">
                                    <div className="w-2 h-2 bg-[#00499A] rounded-full mt-2"/>
                                    <div>
                                        <span className="font-medium ">Username:</span> Their phone number
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 text-[#00499A]">
                                    <div className="w-2 h-2 bg-[#00499A] rounded-full mt-2"/>
                                    <div>
                                        <span className="font-medium ">Password:</span> Auto-generated (must change on first login)
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 text-[#00499A]">
                                    <div className="w-2 h-2 bg-[#00499A] rounded-full mt-2"/>
                                    <div>
                                        <span className="font-medium ">Subscription automatically bypassed</span> (paid by organization)
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 text-[#00499A]">
                                    <div className="w-2 h-2 bg-[#00499A] rounded-full mt-2"/>
                                    <div>Users can immediately download and use the RescueTap app</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3 justify-end items-center">
                        <Button variant="outline" className="w-fit rounded">
                            Close
                        </Button>
                        <Link href={"/users/registered"}>
                        <Button onClick={() => { }} className="max-w-fit rounded bg-[#EF4136] hover:bg-[#EF4136]/50">
                            View New Users
                            <PiEyeThin/>
                        </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="mb-6">
                        <h1 className="text-lg font-semibold mb-2">Bulk Registration</h1>
                        <p className="text-gray-600 text-sm">
                            You can upload a csv file containing information according to shared template for bulk registration.
                        </p>
                    </div>

                    <div className="flex items-center justify-between mb-6 rounded border p-2">
                        <div >
                            <h1 className="font-semibold mb-1">Upload CSV File</h1>
                            <p className="text-sm text-gray-600">
                                Upload a CSV file to onboard multiple users to the RescueTap app with automatic credential generation.
                            </p>
                        </div>
                        <Button variant="outline" className="flex items-center gap-2 rounded">
                            Download Template
                            <BsUpload className="w-4 h-4" />
                        </Button>
                    </div>
                    <Card className="mb-6 border-2 border-dashed border-gray-300">
                        <CardContent className="p-8" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className="rounded-lg p-8 text-center">
                                {!selectedFile && (
                                    isDragActive ? (
                                        <FaRegHandRock className="w-12 h-12 animate-pulse text-gray-700 mx-auto mb-4" />
                                    ) : (
                                        <BsUpload className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                    )
                                )}

                                {selectedFile ? (
                                    <div className="space-y-4">
                                        <BsFiletypeCsv className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                        <h2 className="font-semibold text-lg text-gray-800">
                                            Selected File: <span className="text-[#EF4136]">{selectedFile.name}</span>
                                        </h2>
                                        <div className="flex gap-4 justify-center">
                                            <Button
                                                variant={"outline"}
                                                className="rounded"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFile(null);
                                                }}
                                            >
                                                Remove File
                                            </Button>

                                            <Button
                                                className="bg-[#EF4136] hover:bg-[#EF4136]/50 text-white rounded"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Process onboarding here
                                                    toast.message("Processing CSV...");
                                                }}
                                            >
                                                Process Onboarding
                                            </Button>

                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <h1 className="font-semibold font-roboto text-lg">Drop your CSV file here</h1>
                                        <p className="text-sm pb-2">or click to browse</p>
                                        <Button className="bg-[#EF4136] hover:bg-[#EF4136]/50 rounded font-lato transition-colors duration-300">
                                            Choose File
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-1 gap-6">
                        <Card className={"rounded shadow"}>
                            <CardHeader>
                                <CardTitle className="text-base">CSV Format Requirements:</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1 text-sm">
                                    <li>• First Name, Last Name, Email, Phone, Organization</li>
                                    <li>• Maximum 50 users per upload</li>
                                    <li>• Email addresses and phone numbers must be unique</li>
                                    <li>• All required fields must be filled</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 rounded shadow">
                            <CardHeader>
                                <CardTitle className="text-base text-green-700">Automatic Processing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1 text-sm text-green-700">
                                    <li>• Username: Phone number (as provided)</li>
                                    <li>• Password: Auto-generated (12 characters, secure)</li>
                                    <li>• Login credentials sent via email automatically</li>
                                    <li>• Subscription bypassed (organization-paid)</li>
                                    <li>• Users must change password on first app login</li>
                                    <li>• Immediate app access after credential setup</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
