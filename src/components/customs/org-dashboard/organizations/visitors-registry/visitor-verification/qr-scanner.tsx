"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { QrCode, Camera, CameraOff, User, Phone, Car, Hash } from "lucide-react"
import { Scanner } from '@yudiel/react-qr-scanner';
import { formatVisitorDisplayData, getStatusColor } from "@/lib/utils";

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

interface QRScannerProps {
    onVisitorScanned: (visitor: VisitorData) => void
    isVerifying: boolean
}

function QRScanner({ onVisitorScanned, isVerifying }: QRScannerProps) {
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isTestMode, setIsTestMode] = useState(false)
    const [detectedVisitor, setDetectedVisitor] = useState<VisitorData | null>(null)
    const lastScannedData = useRef<string | null>(null)
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

        let scannedData: string | null = null

        // Check for rawValue property (from @yudiel/react-qr-scanner)
        if (result && result.rawValue) {
            scannedData = result.rawValue.trim()
        } else if (result && result.text) {
            // Fallback for other QR scanner libraries that use 'text' property
            scannedData = result.text.trim()
        } else if (result && typeof result === 'string') {
            // Handle case where result is directly a string
            scannedData = result.trim()
        }

        if (scannedData) {
            try {
                // Try to parse the scanned data as JSON (visitor object)
                const visitorData: VisitorData = JSON.parse(scannedData)

                // Validate that it's a proper visitor object
                if (visitorData._id && visitorData.name && visitorData.entryCode) {
                    // Check if this is the same visitor we just scanned
                    if (lastScannedData.current === scannedData) {
                        console.log('Same visitor detected, ignoring duplicate scan')
                        return
                    }

                    console.log('Visitor QR Code detected:', visitorData)
                    lastScannedData.current = scannedData
                    setDetectedVisitor(visitorData) // Show detected visitor

                    // Clear any existing timeout
                    if (scanTimeoutRef.current) {
                        clearTimeout(scanTimeoutRef.current)
                    }

                    // Add a small delay to prevent rapid successive scans
                    scanTimeoutRef.current = setTimeout(() => {
                        console.log('Processing visitor data:', visitorData)
                        console.log('Sending visitor data to parent component')
                        setDetectedVisitor(null) // Clear detected visitor display
                        onVisitorScanned(visitorData)
                    }, 200) // Reduced to 200ms for faster response

                } else {
                    console.log('Invalid visitor data format:', visitorData)
                    setError('Invalid visitor QR code format')
                }
            } catch (parseError) {
                // If JSON parsing fails, check if it's just an entry code (old format)
                if (/^\d{6}$/.test(scannedData)) {
                    console.log('Old format QR code detected (entry code only):', scannedData)
                    setError(`Old QR format detected. Entry code: ${scannedData}. Please generate a new QR code with full visitor data.`)
                } else {
                    console.log('Failed to parse QR code as visitor data:', parseError)
                    setError('Invalid QR code format - not a valid visitor code')
                }
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
        setDetectedVisitor(null)
        setError(null)
        // Clear any pending scan timeout
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current)
            scanTimeoutRef.current = null
        }
        // Reset last scanned data
        lastScannedData.current = null
    }

    const handleTestQR = () => {
        // Use sample visitor data for testing
        const testVisitorData: VisitorData = {
            "_id": "68d2893cde59f58ff6358a76",
            "tenantId": {
                "_id": "688e103cadeb15b79d7720a8",
                "firstName": "Nehemiah Ekekemzie",
                "lastName": "Ekemezie",
                "phoneNumber": "2348073952125"
            },
            "name": "Victor Alabi",
            "phone": "2347066031881",
            "vehicleNumber": "ERT342RF",
            "purpose": "Visit",
            "startTime": "2025-09-22T10:00:00.000Z",
            "endTime": "2025-09-29T10:00:00.000Z",
            "entryCode": "760434",
            "status": "expired",
            "photoUrl": null,
            "createdAt": "2025-09-23T11:49:16.450Z",
            "updatedAt": "2025-09-28T18:15:39.705Z",
            "__v": 0
        }

        console.log('Test QR button clicked, using visitor data:', testVisitorData)
        setIsTestMode(true)

        // Clear any pending scan timeout
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current)
            scanTimeoutRef.current = null
        }

        // Process the test visitor data immediately
        onVisitorScanned(testVisitorData)

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
                    <h2 className="text-xl font-semibold text-gray-900 font-nunito">Scan Visitor QR</h2>
                    <p className="text-gray-600 font-nunito">Scan visitor QR code to display visitor information</p>
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

                        <p className="text-sm text-gray-500">Position Visitor QR Code in camera view</p>

                        {detectedVisitor && (() => {
                            const formattedData = formatVisitorDisplayData(detectedVisitor)
                            return (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <User className="w-4 h-4 text-blue-600" />
                                        <p className="text-sm text-blue-800 font-medium">
                                            Visitor detected: <span className="font-semibold">{formattedData?.name}</span>
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            <span className="font-medium">Phone:</span>
                                            <span>{formattedData?.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Car className="w-3 h-3" />
                                            <span className="font-medium">Vehicle:</span>
                                            <span>{formattedData?.vehicleNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">Purpose:</span>
                                            <span>{formattedData?.purpose}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Hash className="w-3 h-3" />
                                            <span className="font-medium">Code:</span>
                                            <span className="font-mono font-bold">{formattedData?.entryCode}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(formattedData?.status || '')}`}>
                                            {formattedData?.status}
                                        </span>
                                        <p className="text-xs text-blue-600">Processing visitor data...</p>
                                    </div>
                                </div>
                            )
                        })()}
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

                        {detectedVisitor && (() => {
                            const formattedData = formatVisitorDisplayData(detectedVisitor)
                            return (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <User className="w-4 h-4 text-blue-600" />
                                        <p className="text-sm text-blue-800 font-medium">
                                            Visitor detected: <span className="font-semibold">{formattedData?.name}</span>
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            <span className="font-medium">Phone:</span>
                                            <span>{formattedData?.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Car className="w-3 h-3" />
                                            <span className="font-medium">Vehicle:</span>
                                            <span>{formattedData?.vehicleNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">Purpose:</span>
                                            <span>{formattedData?.purpose}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Hash className="w-3 h-3" />
                                            <span className="font-medium">Code:</span>
                                            <span className="font-mono font-bold">{formattedData?.entryCode}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(formattedData?.status || '')}`}>
                                            {formattedData?.status}
                                        </span>
                                        <p className="text-xs text-blue-600">Processing visitor data...</p>
                                    </div>
                                </div>
                            )
                        })()}

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
                                {isTestMode ? 'processing...' : 'Test QR'}
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
                    <p>Note: QR scanner reads full visitor data objects. Old QR codes (entry code only) will show an error.</p>
                </div>
            </div>
        </div>
    )
}

export default QRScanner
