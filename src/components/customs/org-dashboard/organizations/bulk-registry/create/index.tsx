"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BsFiletypeCsv, BsUpload } from "react-icons/bs";
import { FaRegHandRock } from "react-icons/fa";
import { toast } from "sonner";
import SuccessfulUpload from "./success-modal";
import useOrganization from "@/hooks/use-organization";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { countryCodes, CountryCode } from "@/constants/country-codes";


export default function BulkRegistration() {

    const { bulkOrgUpload, uploading } = useOrganization({})
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0])
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const adminId = user?._id as string;
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [userData, setUserData] = useState({
        users: 0,
        logins: 0
    });

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

    const upload = async () => {
        if (!selectedFile) {
            toast.error("Please upload a csv file")
            return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);
        const res = await bulkOrgUpload(formData, adminId, selectedCountryCode.dialCode);
        console.log(formData, adminId, selectedCountryCode.dialCode)
        if (res.status === "success") {
            setUserData({
                users: res?.data?.length || 0,
                logins: res?.data?.length || 0
            });
            setShowSuccess(true)
        }
    }

    if (showSuccess) {
        return (
            <SuccessfulUpload users={userData?.users || 0} credentails={userData?.users || 0} goBack={() => setShowSuccess(false)} />
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

                    {/* Country Code Selector */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-base font-lato">Select Country Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center flex-col gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Country for phone numbers
                                    </label>
                                    <Select
                                        value={selectedCountryCode.dialCode}
                                        onValueChange={(value) => {
                                            const country = countryCodes.find(c => c.dialCode === value);
                                            if (country) setSelectedCountryCode(country);
                                        }}
                                    >
                                        <SelectTrigger className="w-full min-w-full">
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countryCodes.map((country: CountryCode) => (
                                                <SelectItem key={country.code} value={country.dialCode}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{country.flag}</span>
                                                        <span>{country.name}</span>
                                                        <span className="text-gray-500">({country.dialCode})</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="text-sm text-gray-600 font-nunito">
                                    <p>Selected: <span className="font-medium">{selectedCountryCode.flag} {selectedCountryCode.name} +{selectedCountryCode.dialCode}</span></p>
                                    <p className="text-xs mt-1">This will be applied to all phone numbers in the CSV</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
                                                disabled={uploading}
                                                className="bg-[#EF4136] hover:bg-[#EF4136]/50 text-white rounded"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    upload()
                                                }}
                                            >
                                                {uploading ? "Processing..." : "Process Onboarding"}
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
