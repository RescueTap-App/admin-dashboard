"use client"

import { AlertTriangle, ArrowLeft, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UnauthorizedPageProps {
    type?: "admin" | "organization" | "general"
}

export default function UnauthorizedPage({ type = "general" }: UnauthorizedPageProps) {
    const getContent = () => {
        switch (type) {
            case "admin":
                return {
                    icon: Shield,
                    title: "Admin Access Required",
                    description: "You need administrator privileges to access this dashboard.",
                    message:
                        "This area is restricted to system administrators only. If you believe you should have access, please contact your system administrator.",
                }
            case "organization":
                return {
                    icon: Users,
                    title: "Organization Access Denied",
                    description: "You don't have permission to access this organization's content.",
                    message:
                        "You can only access content for organizations you're a member of. Please check your organization membership or contact the organization administrator.",
                }
            default:
                return {
                    icon: AlertTriangle,
                    title: "Access Denied",
                    description: "You don't have permission to view this page.",
                    message: "Please contact your administrator if you believe this is an error.",
                }
        }
    }

    const content = getContent()
    const IconComponent = content.icon

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <IconComponent className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-900">{content.title}</CardTitle>
                    <CardDescription className="text-base">{content.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-sm text-gray-600 text-center leading-relaxed">{content.message}</p>

                    <div className="flex flex-col gap-3">
                        <Button onClick={() => window.history.back()} variant="default" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>

                        <Button onClick={() => (window.location.href = "/")} variant="outline" className="w-full">
                            Return to Home
                        </Button>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-xs text-gray-500 text-center">Error Code: 401 - Unauthorized</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
