"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { useVerifyCodeMutation } from "@/redux/features/visitors-api"
import { AlertCircle, Hash, QrCode } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import ManualEntry from "./manual-entry"
import QRScanner from "./qr-scanner"

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
    const [verifyCode] = useVerifyCodeMutation()

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
    }

    return (
        <div className="w-full max-w-4xl mx-auto sm:p-6 p-2 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold font-nunito text-gray-900">Visitor Verification</h1>
                <p className="text-gray-600 font-nunito">Verify visitor access using QR code or manual entry</p>
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
                        Scan QR Code
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
                        Manual Entry
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <Card className="shadow-lg">
                <CardContent className="p-8">
                    {activeTab === 'scan' ? (
                        <QRScanner
                            onCodeScanned={handleVerification}
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
