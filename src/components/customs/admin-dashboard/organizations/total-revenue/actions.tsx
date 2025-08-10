import {
    IconDotsVertical
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import useOrganization from "@/hooks/use-organization"

interface Props {
    orgId: string
}

export function RevenueActions({ orgId }: Props) {
    const [open, setOpen] = useState(false);
    // const [nextStatus, setNextStatus] = useState<"pending" | "paid">("Pending")
    const { singleOrganization } = useOrganization({ orgId });
    const handleStatusChange = async () => {
        // const res = await updateOrgStatus({ status: nextStatus })
        // if (res) setOpen(false)
    }

    console.log(singleOrganization)
    return (
        <section>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Update Status
                        </DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        Are you sure you want to change this organization status?
                    </DialogDescription>

                    <DialogFooter className="gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStatusChange}
                        >
                            Update Status
                            {/* {nextStatus === "blacklist" ? "Updating..." : "Update Status"} */}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}
