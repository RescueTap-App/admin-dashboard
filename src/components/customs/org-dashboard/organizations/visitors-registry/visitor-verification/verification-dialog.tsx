"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatVisitorDisplayData, getStatusColor } from "@/lib/utils"
import { User, Phone, Car, Calendar, CheckCircle, XCircle, ExternalLink, Link } from "lucide-react"

interface VisitorData {
    _id: string
    tenantId: {
        _id: string
        firstName: string
        lastName: string
        phoneNumber: string
    }
    name: string
    phone: string
    vehicleNumber: string
    purpose: string
    startTime: string
    endTime: string
    entryCode: string
    status: 'pending' | 'expired' | 'checked_out' | 'checked_in' | 'canceled'
    photoUrl: string | null
    createdAt: string
    updatedAt: string
    __v: number
}

interface VerificationDialogProps {
    isOpen: boolean
    onClose: () => void
    visitor: VisitorData | null | undefined
    isSuccess: boolean
    message: string
}

export default function VerificationDialog({
    isOpen,
    onClose,
    visitor,
    isSuccess,
    message
}: VerificationDialogProps) {

    const handleClose = () => {
        onClose()
    }

    if (!visitor) return null

    const formattedData = formatVisitorDisplayData(visitor)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        {isSuccess ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <span className={isSuccess ? 'text-green-800' : 'text-red-800'}>
                            {isSuccess ? 'Visitor Verified Successfully' : 'Verification Failed'}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status Message */}
                    <div className={`p-4 rounded-lg border ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <p className={`text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                            {message}
                        </p>
                    </div>

                    {/* Visitor Information */}
                    {isSuccess && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">Full Name</span>
                                            <p className="text-lg font-semibold text-gray-900">{formattedData?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">Phone Number</span>
                                            <p className="text-lg text-gray-900">{formattedData?.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Car className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">Vehicle Number</span>
                                            <p className="text-lg text-gray-900">{formattedData?.vehicleNumber}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Purpose of Visit</span>
                                        <p className="text-sm text-gray-900">{formattedData?.purpose}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Entry Code</span>
                                        <p className="text-2xl font-mono font-bold bg-gray-100 px-3 py-2 rounded-lg text-gray-900">
                                            {formattedData?.entryCode}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Status</span>
                                        <div className="mt-1">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(formattedData?.status || '')}`}>
                                                {formattedData?.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Visit Details */}
                            <div className="border-t pt-6">
                                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Visit Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Start Time</span>
                                        <p className="text-sm text-gray-900">{formattedData?.startTime}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">End Time</span>
                                        <p className="text-sm text-gray-900">{formattedData?.endTime}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Created</span>
                                        <p className="text-sm text-gray-900">{formattedData?.createdAt}</p>
                                    </div>
                                    {formattedData?.tenantInfo && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">Host (Tenant)</span>
                                            <p className="text-sm text-gray-900">{formattedData.tenantInfo.name}</p>
                                            <p className="text-xs text-gray-600">{formattedData.tenantInfo.phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            onClick={handleClose}
                            variant="outline"
                            className="px-6"
                        >
                            Close
                        </Button>
                        {isSuccess && (
                            <Link href="/org/visitors">
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    See Registry
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
