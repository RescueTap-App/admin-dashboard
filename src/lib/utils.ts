import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtVerify } from "jose";
import { jwtDecode } from "jwt-decode";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatCurrency = (amount: number, currency: 'NGN' | 'USD' = 'NGN') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formatter.format(amount);
}

export function formatNumber(value: number | string): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return '0';

  const rounded = Math.round(number);

  return new Intl.NumberFormat('en-US').format(rounded);
}


export function disableConsoleLogsInProduction() {
  if (process.env.NODE_ENV === "production") {
    for (const method of ["log", "debug", "info", "warn"] as const) {
      console[method] = () => { };
    }
  }
}

export function extractPlainText(content: string, wordLimit = 6) {
  // Step 1: Remove HTML tags using a regular expression
  const plainText = content.replace(/<\/?[^>]+(>|$)/g, "");
  // Step 2: Replace HTML entity codes like `&nbsp;` with a space
  const cleanedText = plainText.replace(/&nbsp;/g, " ").trim();
  // Step 3: Split the cleaned text into words
  const words = cleanedText.split(/\s+/);
  // Step 4: Extract the first 'wordLimit' words
  return words.slice(0, wordLimit).join(" ");
}


const JWT_SECRET = process.env.JWT_SECRET!;

export async function verifyToken(token: string | Uint8Array<ArrayBufferLike>) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};



export function formatDriverForQR(driver: { vehicleModel: string; _id: string; profileImage: string; firstName: string; lastName: string; plateNumber: string; status: string; vehicleImage: string; }) {
  return {
    cluster: driver.vehicleModel,
    id: driver._id,
    image: driver.profileImage,
    name: `${driver.firstName} ${driver.lastName}`,
    licensePlate: driver.plateNumber,
    status: driver.status,
    vehicleImage: driver.vehicleImage,
    vehicleName: driver.vehicleModel,
  }
}
export function formatVisitorForQR(visitor: { name: string; _id: string; phone: string; vehicleNumber: string; purpose: string; photoUrl: string; entryCode: string; status: string; startTime: string; endTime: string; createdAt: Date; updatedAt: Date; tenantId?: { _id: string; firstName: string; lastName: string; phoneNumber: string; }; }) {
  return {
    _id: visitor._id,
    tenantId: visitor.tenantId || {
      _id: "",
      firstName: "",
      lastName: "",
      phoneNumber: ""
    },
    name: visitor.name,
    phone: visitor.phone,
    vehicleNumber: visitor.vehicleNumber,
    purpose: visitor.purpose,
    startTime: visitor.startTime,
    endTime: visitor.endTime,
    entryCode: visitor.entryCode,
    status: visitor.status,
    photoUrl: visitor.photoUrl,
    createdAt: visitor.createdAt,
    updatedAt: visitor.updatedAt,
    __v: 0
  }
}


export async function generateAndDownloadQR(data: { name: string }, type: 'driver' | 'visitor' = 'driver') {
  if (typeof window === "undefined") return // Prevent execution during SSR

  const QRCode = (await import("qrcodejs2")).default

  try {
    // For both visitors and drivers, use the full JSON data
    const qrContent = JSON.stringify(data)

    const qrContainer = document.createElement("div")
    new QRCode(qrContainer, {
      text: qrContent,
      width: 1024,
      height: 1024,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: 2, // High error correction
    })

    setTimeout(() => {
      const canvas = qrContainer.querySelector("canvas")
      if (!canvas) throw new Error("QR canvas not found")

      const imgData = canvas.toDataURL("image/png")
      const img = new Image()
      img.src = imgData

      img.onload = () => {
        const borderSize = 20
        const enhancedCanvas = document.createElement("canvas")
        enhancedCanvas.width = img.width + borderSize * 2
        enhancedCanvas.height = img.height + borderSize * 2

        const ctx = enhancedCanvas.getContext("2d")
        if (!ctx) throw new Error("Failed to get canvas context")

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, enhancedCanvas.width, enhancedCanvas.height)
        ctx.drawImage(img, borderSize, borderSize)

        const finalImageData = enhancedCanvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = finalImageData
        link.download = `qr-${data.name.replace(/\s+/g, "-").toLowerCase()}-${type}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }, 500)
  } catch (err) {
    console.error("QR Code generation error:", err)
    alert("Failed to generate QR code. Please try again.")
  }
}

// Legacy function for drivers (maintains backward compatibility)
export async function generateAndDownloadDriverQR(driverData: { name: string }) {
  return generateAndDownloadQR(driverData, 'driver')
}

// New function specifically for visitors
export async function generateAndDownloadVisitorQR(visitorData: { name: string; entryCode: string }) {
  return generateAndDownloadQR(visitorData, 'visitor')
}

// Utility functions for formatting scanned data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatJSONData(data: any, indent: number = 2): string {
  try {
    return JSON.stringify(data, null, indent)
  } catch (error) {
    console.error(error)
    return String(data)
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatVisitorDisplayData(visitor: any) {
  if (!visitor) return null

  return {
    id: visitor._id || 'N/A',
    name: visitor.name || 'N/A',
    phone: visitor.phone || 'N/A',
    vehicleNumber: visitor.vehicleNumber || 'N/A',
    purpose: visitor.purpose || 'N/A',
    entryCode: visitor.entryCode || 'N/A',
    status: visitor.status || 'N/A',
    startTime: visitor.startTime ? new Date(visitor.startTime).toLocaleString() : 'N/A',
    endTime: visitor.endTime ? new Date(visitor.endTime).toLocaleString() : 'N/A',
    createdAt: visitor.createdAt ? new Date(visitor.createdAt).toLocaleString() : 'N/A',
    tenantInfo: visitor.tenantId ? {
      name: `${visitor.tenantId.firstName || ''} ${visitor.tenantId.lastName || ''}`.trim() || 'N/A',
      phone: visitor.tenantId.phoneNumber || 'N/A'
    } : null
  }
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'checked_in':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'checked_out':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'canceled':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}