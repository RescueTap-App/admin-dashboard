"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { QrCode, Camera, CameraOff } from "lucide-react"
import { Scanner } from '@yudiel/react-qr-scanner';

interface QRScannerProps {
    onCodeScanned: (code: string) => void
    isVerifying: boolean
}

function QRScanner({ onCodeScanned, isVerifying }: QRScannerProps) {
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isTestMode, setIsTestMode] = useState(false)
    const [detectedCode, setDetectedCode] = useState<string | null>(null)
    const lastScannedCode = useRef<string | null>(null)
    const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (scanTimeoutRef.current) {
                clearTimeout(scanTimeoutRef.current)
            }
        }
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScan = (result: any) => {
        console.log('QR Scanner result:', result)

        // Prevent scanning during test mode or verification
        if (isVerifying || isTestMode) {
            console.log('Already verifying or in test mode, ignoring scan')
            return
        }

        let code: string | null = null

        // Check for rawValue property (from @yudiel/react-qr-scanner)
        if (result && result.rawValue) {
            code = result.rawValue.trim()
        } else if (result && result.text) {
            // Fallback for other QR scanner libraries that use 'text' property
            code = result.text.trim()
        } else if (result && typeof result === 'string') {
            // Handle case where result is directly a string
            code = result.trim()
        }

        if (code) {
            // Validate that the QR code contains a 6-digit number
            if (/^\d{6}$/.test(code)) {
                // Check if this is the same code we just scanned
                if (lastScannedCode.current === code) {
                    console.log('Same code detected, ignoring duplicate scan')
                    return
                }

                console.log('QR Code detected:', code)
                lastScannedCode.current = code
                setDetectedCode(code) // Show detected code

                // Clear any existing timeout
                if (scanTimeoutRef.current) {
                    clearTimeout(scanTimeoutRef.current)
                }

                // Add a small delay to prevent rapid successive scans
                scanTimeoutRef.current = setTimeout(() => {
                    console.log('Processing QR code:', code)
                    console.log('Sending verification request for code:', code)
                    setDetectedCode(null) // Clear detected code display
                    onCodeScanned(code!)
                }, 200) // Reduced to 200ms for faster response

            } else {
                console.log('Invalid QR code format:', code)
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleError = (error: any) => {
        console.error('QR Scanner error:', error)
        setError('Camera error occurred. Please try again.')
    }

    const startScanning = () => {
        setError(null)
        setIsScanning(true)
    }

    const stopScanning = () => {
        setIsScanning(false)
        setIsTestMode(false)
        setDetectedCode(null)
        // Clear any pending scan timeout
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current)
            scanTimeoutRef.current = null
        }
        // Reset last scanned code
        lastScannedCode.current = null
    }

    const handleTestQR = () => {
        // Use the actual QR code that was detected (127094) for testing
        const testCode = "127094" // Use the real code that exists in your system
        console.log('Test QR button clicked, using code:', testCode)
        setIsTestMode(true)

        // Clear any pending scan timeout
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current)
            scanTimeoutRef.current = null
        }

        // Process the test code immediately
        onCodeScanned(testCode)

        // Reset test mode after a delay
        setTimeout(() => {
            setIsTestMode(false)
        }, 2000)
    }

    return (
        <div className="space-y-6">
            {/* QR Code Icon and Title */}
            <div className="flex items-center gap-4">
                <div className="sm:p-3 p-2 bg-gray-100 rounded-lg">
                    <QrCode className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 font-nunito">Verify Visitor QR</h2>
                    <p className="text-gray-600 font-nunito">Enter QR Code to verify visitor access</p>
                </div>
            </div>

            {/* Camera Section */}
            <div className="space-y-4">
                {!isScanning ? (
                    <div className="text-center space-y-4">
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center space-y-2">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                                <p className="text-gray-500">Camera not active</p>
                            </div>
                        </div>

                        <Button
                            onClick={startScanning}
                            disabled={isVerifying}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                        >
                            <Camera className="w-4 h-4 mr-2" />
                            Open Camera
                        </Button>

                        <p className="text-sm text-gray-500">Position QR Code in camera view</p>

                        {detectedCode && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800 font-medium">
                                    Code detected: <span className="font-mono">{detectedCode}</span>
                                </p>
                                <p className="text-xs text-blue-600 mt-1">Processing verification...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                            <Scanner
                                onScan={handleScan}
                                onError={handleError}
                            />

                            {/* Scanning overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-48 h-48 border-2 border-red-500 rounded-lg relative">
                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500"></div>
                                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-500"></div>
                                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500"></div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-500"></div>
                                </div>
                            </div>
                        </div>

                        {detectedCode && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800 font-medium">
                                    Code detected: <span className="font-mono">{detectedCode}</span>
                                </p>
                                <p className="text-xs text-blue-600 mt-1">Processing verification...</p>
                            </div>
                        )}

                        <div className="flex justify-center gap-2">
                            <Button
                                onClick={stopScanning}
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                                <CameraOff className="w-4 h-4 mr-2" />
                                Stop Camera
                            </Button>
                            <Button
                                onClick={handleTestQR}
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                disabled={isVerifying || isTestMode}
                            >
                                {isTestMode ? 'verifying...' : 'Verify QR'}
                            </Button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-center">
                        <p className="text-red-600 text-sm">{error}</p>
                        <p className="text-gray-500 text-xs mt-1">
                            Please ensure camera permissions are granted and try again.
                        </p>
                    </div>
                )}

                {/* Debug Information */}
                <div className="text-center text-xs text-gray-400 space-y-1">
                    <p>Debug: isScanning={String(isScanning)}, isTestMode={String(isTestMode)}</p>
                </div>
            </div>
        </div>
    )
}

export default QRScanner
