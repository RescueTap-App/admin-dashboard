"use client"

import { UpdateVisitorForm } from "@/components/customs/org-dashboard/organizations/visitors-registry/visitors-log/update-visitor-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import useVisitors from "@/hooks/use-visitors"
import { formatVisitorForQR, generateAndDownloadVisitorQR } from "@/lib/utils"
import { ActiveVisitorsLogTableTypes, VisitorDataTypes } from "@/types/visitors.types"
import { IconDotsVertical } from "@tabler/icons-react"
import { useState } from "react"

export function VisitorsLogActions({ data }: { data: ActiveVisitorsLogTableTypes }) {
    const [cancel, setCancel] = useState(false)
    const [checkOut, setCheckOut] = useState(false)
    const [update, setUpdate] = useState(false)
    const isMobile = useIsMobile()
    const { checkOutVisitor, cancelVisitor, updateVisitor } = useVisitors({ fetchVisitor: true, visitorId: data._id })

    const handleCheckOut = async () => {
        const res = await checkOutVisitor()
        if (res) {
            setCheckOut(false)
        }
    }

    const handleCancel = async () => {
        const res = await cancelVisitor()
        if (res) {
            setCancel(false)
        }
    }

    const handleUpdate = async (updateData: VisitorDataTypes) => {
        const res = await updateVisitor(updateData)
        if (res) {
            setUpdate(false)
        }
    }

    const handleDownloadQR = () => {
        const visitorData = {
            entryCode: data.entryCode,
        }
        const formatted = formatVisitorForQR(visitorData)
        generateAndDownloadVisitorQR(formatted)
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost"><IconDotsVertical /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem disabled={data.status !== 'checked_in'} onClick={() => setTimeout(() => {
                        setCheckOut(true)
                    }, 60)}>Check out</DropdownMenuItem>

                    <DropdownMenuItem disabled={data.status === 'checked_in'} onClick={() => setTimeout(() => {
                        setUpdate(true)
                    }, 60)}>Update Visitor</DropdownMenuItem>

                    <DropdownMenuItem onClick={handleDownloadQR}>
                        Download QR Code
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        variant="destructive"
                        disabled={data.status !== 'pending'}
                        onClick={() => setTimeout(() => {
                            setCancel(true)
                        }, 60)}
                    >
                        Cancel Visitor
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>


            {/* Cancel Dialog */}
            <Dialog open={cancel} onOpenChange={setCancel}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Visitor</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this visitor? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancel(false)}>
                            Keep Visitor
                        </Button>
                        <Button variant="destructive" onClick={handleCancel}>
                            Cancel Visitor
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Check Out Dialog */}
            <Dialog open={checkOut} onOpenChange={setCheckOut}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Check Out Visitor</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to check out {data.name}? This will mark their visit as completed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCheckOut(false)}>
                            Keep Checked In
                        </Button>
                        <Button onClick={handleCheckOut}>
                            Check Out
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Visitor - Responsive Dialog/Drawer */}
            {isMobile ? (
                <Drawer open={update} onOpenChange={setUpdate} direction="bottom">
                    <DrawerContent className="max-h-[90vh]">
                        <DrawerHeader>
                            <DrawerTitle>Update Visitor</DrawerTitle>
                            <DrawerDescription>
                                Update visitor information for {data.name}
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="px-4 pb-4 overflow-y-auto">
                            <UpdateVisitorForm
                                visitorData={data}
                                onSubmit={handleUpdate}
                                onCancel={() => setUpdate(false)}
                            />
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={update} onOpenChange={setUpdate}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Update Visitor</DialogTitle>
                            <DialogDescription>
                                Update visitor information for {data.name}
                            </DialogDescription>
                        </DialogHeader>
                        <UpdateVisitorForm
                            visitorData={data}
                            onSubmit={handleUpdate}
                            onCancel={() => setUpdate(false)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
