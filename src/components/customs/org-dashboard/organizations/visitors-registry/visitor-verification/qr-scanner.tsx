"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { QrCode, Camera, CameraOff, SwitchCamera } from "lucide-react"
import { Scanner } from '@yudiel/react-qr-scanner';
import { useVerifyCodeMutation } from "@/redux/features/visitors-api";

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
    checkedInAt: string
    status: 'pending' | 'expired' | 'checked_out' | 'checked_in' | 'canceled'
    photoUrl: string | null
    createdAt: string
    updatedAt: string
    __v: number
}

type FacingMode = "user" | "environment"

interface QRScannerProps {
    onVisitorScanned: (visitor: VisitorData) => void
    onVerificationComplete: (result: { success: boolean; message: string; visitor?: VisitorData }) => void
    isVerifying: boolean
    tenantId: string
    disabled?: boolean
}

function exactConstraints(facing: FacingMode): MediaTrackConstraints {
    return { facingMode: { exact: facing } }
}

function stopStream(stream: MediaStream | null) {
    stream?.getTracks().forEach((track) => track.stop())
}

async function openExact(facing: FacingMode): Promise<MediaStream | null> {
    try {
        return await navigator.mediaDevices.getUserMedia({
            video: exactConstraints(facing),
        })
    } catch {
        return null
    }
}

async function openAnyCamera(): Promise<MediaStream | null> {
    try {
        return await navigator.mediaDevices.getUserMedia({ video: true })
    } catch {
        return null
    }
}

function deviceCanSwitchCameras(front: boolean, videoInputCount: number) {
    const touchPoints = navigator.maxTouchPoints ?? 0
    return videoInputCount > 1 || (front && touchPoints > 1)
}

function QRScanner({ onVisitorScanned, onVerificationComplete, isVerifying, tenantId, disabled = false }: QRScannerProps) {
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isTestMode, setIsTestMode] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [isCameraInitializing, setIsCameraInitializing] = useState(false)
    const [isQrVerifying, setIsQrVerifying] = useState(false)
    const [facingMode, setFacingMode] = useState<FacingMode>("user")
    const [useExactFacing, setUseExactFacing] = useState(true)
    const [canSwitchCamera, setCanSwitchCamera] = useState(false)
    const [isSwitchingCamera, setIsSwitchingCamera] = useState(false)
    const lastScannedData = useRef<string | null>(null)
    const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [verifyCode] = useVerifyCodeMutation()

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (scanTimeoutRef.current) {
                clearTimeout(scanTimeoutRef.current)
            }
        }
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScan = async (result: any) => {
        console.log('QR Scanner result:', result)

        // Prevent scanning during test mode or verification
        if (isVerifying || isTestMode || isQrVerifying || disabled || !tenantId) {
            console.log('Already verifying or in test mode, ignoring scan')
            return
        }

        let scannedData: string | null = null

        // Handle array format (result is an array with objects)
        if (Array.isArray(result) && result.length > 0) {
            const firstResult = result[0]
            if (firstResult && firstResult.rawValue) {
                scannedData = firstResult.rawValue.trim()
            }
        }
        // Check for rawValue property (from @yudiel/react-qr-scanner)
        else if (result && result.rawValue) {
            scannedData = result.rawValue.trim()
        } else if (result && result.text) {
            // Fallback for other QR scanner libraries that use 'text' property
            scannedData = result.text.trim()
        } else if (result && typeof result === 'string') {
            // Handle case where result is directly a string
            scannedData = result.trim()
        }

        if (scannedData) {
            // Check if this is the same entry code we just scanned
            if (lastScannedData.current === scannedData) {
                console.log('Same entry code detected, ignoring duplicate scan')
                return
            }

            let entryCode: string | null = null

            // Try to extract entry code from different formats
            // if (/^\d{6}$/.test(scannedData)) {
            //     // Direct 6-digit entry code
            //     entryCode = scannedData
            // } else {

            // Temporary removal of 6-digit validation
            entryCode = scannedData;

            // Try to parse as JSON and extract entry code
            try {
                const parsedData = JSON.parse(scannedData)
                console.log('Parsed QR data:', parsedData)

                // Check for different possible field names
                if (parsedData.name /* && /^\d{6}$/.test(parsedData.name) */) {
                    entryCode = parsedData.name
                } else if (parsedData.code /* && /^\d{6}$/.test(parsedData.code) */) {
                    entryCode = parsedData.code
                } else if (parsedData.entryCode /* && /^\d{6}$/.test(parsedData.entryCode) */) {
                    entryCode = parsedData.entryCode
                } else if (parsedData.id /* && /^\d{6}$/.test(parsedData.id) */) {
                    entryCode = parsedData.id
                }
            } catch (parseError) {
                console.log('Failed to parse QR code as JSON:', parseError)
            }
            // }

            if (entryCode) {
                console.log('Entry code extracted:', entryCode)
                lastScannedData.current = scannedData

                // Clear any existing timeout
                if (scanTimeoutRef.current) {
                    clearTimeout(scanTimeoutRef.current)
                }

                // Add a small delay to prevent rapid successive scans
                scanTimeoutRef.current = setTimeout(async () => {
                    console.log('Processing entry code:', entryCode)
                    setIsQrVerifying(true)

                    // Automatically verify the visitor using the entry code
                    try {
                        console.log('Auto-verifying visitor with entry code:', entryCode)
                        const result = await verifyCode({
                            data: { code: entryCode, tenantId: tenantId }
                        }).unwrap()

                        console.log('Verification successful:', result)
                        onVerificationComplete({
                            success: true,
                            message: result.message || "Visitor verified successfully!",
                            visitor: result.visitor || result
                        })
                        onVisitorScanned(result.visitor || result)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                        console.error('Verification failed:', error)
                        const errorMessage = error?.data?.message || "Invalid or expired code"
                        onVerificationComplete({
                            success: false,
                            message: errorMessage,
                            visitor: undefined
                        })
                    } finally {
                        setIsQrVerifying(false)
                    }
                }, 200) // Reduced to 200ms for faster response

            } else {
                console.log('Invalid QR code format - no valid 6-digit entry code found:', scannedData)
                setError('Invalid QR code format - must contain a 6-digit entry code')
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleError = (error: any) => {
        console.error('QR Scanner error:', error)
        setCameraError('Camera error occurred. Please check permissions and try again.')
        setIsScanning(false)
        setIsCameraInitializing(false)
    }

    const startScanning = async (preferred: FacingMode = "user") => {
        setError(null)
        setCameraError(null)
        setIsScanning(false)
        setIsCameraInitializing(true)

        try {
            const front = await openExact("user")
            stopStream(front)
            const back = await openExact("environment")
            stopStream(back)

            const devices = await navigator.mediaDevices.enumerateDevices()
            const videoInputCount = devices.filter((device) => device.kind === "videoinput").length
            const available = {
                user: Boolean(front),
                environment: Boolean(back),
            }

            let active: FacingMode | null = null
            if (available[preferred]) active = preferred
            else if (available.user) active = "user"
            else if (available.environment) active = "environment"

            if (!active) {
                const fallback = await openAnyCamera()
                if (!fallback) {
                    throw new Error("No camera devices found")
                }
                stopStream(fallback)
                setUseExactFacing(false)
                setCanSwitchCamera(false)
                setFacingMode("user")
            } else {
                setUseExactFacing(true)
                setCanSwitchCamera((available.user && available.environment) || deviceCanSwitchCameras(available.user, videoInputCount))
                setFacingMode(active)
            }

            setIsScanning(true)
            setIsCameraInitializing(false)
        } catch (err) {
            console.error('Camera initialization failed:', err)
            setCameraError('Camera access denied or not available. Please check permissions and try again.')
            setIsScanning(false)
            setIsCameraInitializing(false)
        }
    }

    const switchCamera = async () => {
        const next: FacingMode = facingMode === "user" ? "environment" : "user"
        setCameraError(null)
        setIsSwitchingCamera(true)

        const stream = await openExact(next)
        if (!stream) {
            setIsSwitchingCamera(false)
            setCameraError(next === "user"
                ? "Front camera is not available on this device."
                : "Back camera is not available on this device.")
            return
        }

        stopStream(stream)
        setUseExactFacing(true)
        setFacingMode(next)
        setIsSwitchingCamera(false)
    }

    const stopScanning = () => {
        setIsScanning(false)
        setIsTestMode(false)
        setIsQrVerifying(false)
        setError(null)
        setCameraError(null)
        setIsCameraInitializing(false)
        setIsSwitchingCamera(false)
        // Clear any pending scan timeout
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current)
            scanTimeoutRef.current = null
        }
        // Reset last scanned data
        lastScannedData.current = null
    }

    // const handleTestQR = async () => {
    //     // Use a sample entry code for testing
    //     const testEntryCode = "565512" // Using the entry code from your example

    //     console.log('Test QR button clicked, using entry code:', testEntryCode)
    //     setIsTestMode(true)

    //     // Clear any pending scan timeout
    //     if (scanTimeoutRef.current) {
    //         clearTimeout(scanTimeoutRef.current)
    //         scanTimeoutRef.current = null
    //     }

    //     // Automatically verify the test entry code
    //     setIsQrVerifying(true)
    //     try {
    //         console.log('Auto-verifying test entry code:', testEntryCode)
    //         const result = await verifyCode({
    //             data: { code: testEntryCode, tenantId: tenantId }
    //         }).unwrap()

    //         console.log('Test verification successful:', result)
    //         onVerificationComplete({
    //             success: true,
    //             message: result.message || "Visitor verified successfully!",
    //             visitor: result.visitor || result
    //         })
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     } catch (error: any) {
    //         console.error('Test verification failed:', error)
    //         const errorMessage = error?.data?.message || "Invalid or expired code"
    //         onVerificationComplete({
    //             success: false,
    //             message: errorMessage,
    //             visitor: undefined
    //         })
    //     } finally {
    //         setIsQrVerifying(false)
    //     }

    //     // Reset test mode after a delay
    //     setTimeout(() => {
    //         setIsTestMode(false)
    //     }, 2000)
    // }

    return (
        <div className="space-y-6">
            {/* QR Code Icon and Title */}
            <div className="flex items-center gap-4">
                <div className="sm:p-3 p-2 bg-gray-100 rounded-lg">
                    <QrCode className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 font-nunito">Scan Visitor QR</h2>
                    <p className="text-gray-600 font-nunito">Scan a visitor or personnel QR code with the front camera</p>
                </div>
            </div>

            {/* Camera Section */}
            <div className="space-y-4">
                {!isScanning ? (
                    <div className="text-center space-y-4">
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center space-y-2">
                                {isCameraInitializing ? (
                                    <>
                                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        <p className="text-gray-600">Initializing camera...</p>
                                    </>
                                ) : cameraError ? (
                                    <>
                                        <CameraOff className="w-12 h-12 text-red-400 mx-auto" />
                                        <p className="text-red-600 font-medium">Camera Error</p>
                                        <p className="text-sm text-gray-500">{cameraError}</p>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                                        <p className="text-gray-500">Camera not active</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={() => startScanning(facingMode)}
                            disabled={disabled || isVerifying || isCameraInitializing || isQrVerifying}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 disabled:opacity-50"
                        >
                            {isCameraInitializing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Initializing...
                                </>
                            ) : (
                                <>
                                    <Camera className="w-4 h-4 mr-2" />
                                    Open Camera
                                </>
                            )}
                        </Button>

                        <p className="text-sm text-gray-500">
                            {disabled
                                ? "Select an organization before opening the camera."
                                : "The front camera opens first. On a phone, switch between the front and back cameras while scanning."}
                        </p>

                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                            {cameraError ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <CameraOff className="w-12 h-12 text-red-400 mx-auto" />
                                        <p className="text-red-600 font-medium">Camera Failed to Load</p>
                                        <p className="text-sm text-gray-300">{cameraError}</p>
                                        <Button
                                            onClick={() => startScanning(facingMode)}
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 border-white text-white hover:bg-white hover:text-black"
                                        >
                                            <Camera className="w-4 h-4 mr-2" />
                                            Retry Camera
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Scanner
                                        key={`${facingMode}-${useExactFacing}`}
                                        constraints={useExactFacing ? exactConstraints(facingMode) : { facingMode }}
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
                                </>
                            )}
                        </div>


                        <p className="text-center text-sm text-gray-500">
                            {facingMode === "user" ? "Front camera" : "Back camera"}
                        </p>
                        <div className="flex justify-center gap-2 flex-wrap">
                            <Button
                                onClick={stopScanning}
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                                <CameraOff className="w-4 h-4 mr-2" />
                                Stop Camera
                            </Button>
                            {canSwitchCamera && (
                                <Button
                                    onClick={() => void switchCamera()}
                                    variant="outline"
                                    disabled={isCameraInitializing || isSwitchingCamera || isQrVerifying}
                                    className="border-gray-600 text-gray-700 hover:bg-gray-50"
                                >
                                    <SwitchCamera className="w-4 h-4 mr-2" />
                                    {isSwitchingCamera
                                        ? "Switching..."
                                        : facingMode === "user" ? "Use back camera" : "Use front camera"}
                                </Button>
                            )}
                            {/* <Button
                                onClick={handleTestQR}
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                disabled={disabled || isVerifying || isTestMode || isQrVerifying}
                            >
                                {isTestMode || isQrVerifying ? 'processing...' : 'Test QR'}
                            </Button> */}
                        </div>
                    </div>
                )}

                {(error || cameraError) && (
                    <div className="text-center">
                        <p className="text-red-600 text-sm">{error || cameraError}</p>
                        <p className="text-gray-500 text-xs mt-1">
                            {cameraError ?
                                'Please check camera permissions and ensure no other applications are using the camera.' :
                                'Please ensure camera permissions are granted and try again.'
                            }
                        </p>
                    </div>
                )}

                {/* Debug Information */}
                {/* <div className="text-center text-xs text-gray-400 space-y-1">
                    <p>Debug: isScanning={String(isScanning)}, isTestMode={String(isTestMode)}, isCameraInitializing={String(isCameraInitializing)}, isQrVerifying={String(isQrVerifying)}</p>
                    <p>Camera Error: {cameraError || 'None'}</p>
                    <p>Note: QR scanner only accepts 6-digit entry codes. Visitor/Personnel data is fetched from the server.</p>
                </div> */}
            </div>
        </div>
    )
}

export default QRScanner
