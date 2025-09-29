"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { formatVisitorDisplayData, formatJSONData, getStatusColor } from "@/lib/utils"
import { useVerifyCodeMutation } from "@/redux/features/visitors-api"
import { AlertCircle, Check, Hash, QrCode, User, Phone, Car, Calendar, Eye, EyeOff, Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import ManualEntry from "./manual-entry"
import QRScanner from "./qr-scanner"

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

type VerificationResult = {
    success: boolean
    message: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visitor?: any
}

export default function VisitorVerification() {
    const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan')
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
    const [isVerifying, setIsVerifying] = useState(false)
    const [scannedVisitor, setScannedVisitor] = useState<VisitorData | null>(null)
    const [showRawData, setShowRawData] = useState(false)
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)
    const [verifyCode] = useVerifyCodeMutation()

    const handleVisitorScanned = (visitor: VisitorData) => {
        console.log('Visitor scanned:', visitor)
        setScannedVisitor(visitor)
        setVerificationResult(null) // Clear any previous verification results
        toast.success(`Visitor ${visitor.name} scanned successfully!`)
    }

    const handleVerification = async (code: string) => {
        if (!code || code.length !== 6) {
            setVerificationResult({
                success: false,
                message: "Please enter a valid 6-digit code"
            })
            return
        }

        setIsVerifying(true)
        setVerificationResult(null)

        try {
            const result = await verifyCode({
                data: { code }
            }).unwrap()

            setVerificationResult({
                success: true,
                message: "Visitor verified successfully!",
                visitor: result
            })

            toast.success("Visitor verified successfully!")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error?.data?.message || "Invalid or expired code"
            setVerificationResult({
                success: false,
                message: errorMessage
            })

            toast.error(errorMessage)
        } finally {
            setIsVerifying(false)
        }
    }

    const clearResult = () => {
        setVerificationResult(null)
        setScannedVisitor(null)
        setShowRawData(false)
        setCopiedToClipboard(false)
    }

    const copyToClipboard = async (data: VisitorData) => {
        try {
            const formattedData = formatJSONData(data)
            await navigator.clipboard.writeText(formattedData)
            setCopiedToClipboard(true)
            toast.success("Data copied to clipboard!")
            setTimeout(() => setCopiedToClipboard(false), 2000)
        } catch (error) {
            toast.error("Failed to copy data to clipboard")
            console.error(error)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto sm:p-6 p-2 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold font-nunito text-gray-900">Visitor Verification</h1>
                <p className="text-gray-600 font-nunito">Scan visitor QR code to view information or manually verify access</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center">
                <div className="flex bg-gray-100 rounded-lg p-1 font-nunito">
                    <button
                        onClick={() => {
                            setActiveTab('scan')
                            clearResult()
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'scan'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <QrCode className="w-4 h-4" />
                        Scan Visitor QR
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('manual')
                            clearResult()
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'manual'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Hash className="w-4 h-4" />
                        Verify Access
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <Card className="shadow-lg">
                <CardContent className="p-8">
                    {activeTab === 'scan' ? (
                        <QRScanner
                            onVisitorScanned={handleVisitorScanned}
                            isVerifying={isVerifying}
                        />
                    ) : (
                        <ManualEntry
                            onCodeSubmit={handleVerification}
                            isVerifying={isVerifying}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Scanned Visitor Information */}
            {scannedVisitor && (() => {
                const formattedData = formatVisitorDisplayData(scannedVisitor)
                return (
                    <Card className="shadow-lg border-blue-200">
                        <CardContent className="p-6">
                            {/* Header with actions */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Scanned Visitor Information</h3>
                                        <p className="text-sm text-gray-600">Visitor data from QR code scan</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowRawData(!showRawData)}
                                        className="flex items-center gap-2"
                                    >
                                        {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(scannedVisitor)}
                                        className="flex items-center gap-2"
                                    >
                                        {copiedToClipboard ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copiedToClipboard ? 'Copied!' : 'Copy Data'}
                                    </Button>
                                </div>
                            </div>

                            {/* Formatted Visitor Information */}
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
                                            <p className="text-lg text-gray-900">{formattedData?.purpose}</p>
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

                                {/* Raw Data Viewer */}
                                {showRawData && (
                                    <div className="border-t pt-6">
                                        <h4 className="text-md font-semibold text-gray-900 mb-4">Raw JSON Data</h4>
                                        <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                                            <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                                                {formatJSONData(scannedVisitor)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* Information Note */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> This information was scanned from the visitor&apos;s QR code.
                                        To verify access, use the &apos;Verify Access&apos; tab and enter the entry code manually.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })()}

            {/* Verification Result */}
            {verificationResult && (
                <Alert className={`${verificationResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <AlertCircle className={`h-4 w-4 ${verificationResult.success ? 'text-green-600' : 'text-red-600'}`} />
                    <AlertDescription className={verificationResult.success ? 'text-green-800' : 'text-red-800'}>
                        <div className="font-semibold mb-1">
                            {verificationResult.success ? 'Verification Successful' : 'Invalid or Expired Code'}
                        </div>
                        <div className="text-sm">
                            {verificationResult.message}
                        </div>
                        {!verificationResult.success && (
                            <div className="text-sm mt-2">
                                The code you entered is either expired or invalid. Kindly tell the visitor to confirm their code or contact resident for a new code.
                            </div>
                        )}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
