import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Mail, Users } from "lucide-react";
import Link from "next/link";
import { PiEyeThin, PiSealCheckBold } from "react-icons/pi";

interface UploadProps {
    users:number
    logins:number;
    crdentails:number
}

function SuccessfulUpload() {
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

export default SuccessfulUpload
