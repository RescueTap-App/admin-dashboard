"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useDrivers from "@/hooks/use-drivers"
import { formatDriverForQR, generateAndDownloadQR } from "@/lib/utils"
import { IconDotsVertical } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

interface DriverProps {
  driverId: string
}

export function DriversActions({ driverId }: DriverProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nextStatus, setNextStatus] = useState<"active" | "blacklist">("blacklist")
  const { updateStatus, driver } = useDrivers({ driverId, fetchADriver: true })

  const handleStatusChange = async () => {
    const res = await updateStatus({ status: nextStatus })
    if (res) setDialogOpen(false)
  }

  const handleDownloadQR = () => {
    if (!driver) return
    const formatted = formatDriverForQR(driver)
    generateAndDownloadQR(formatted)
  }

  const isBlacklisted = driver?.status?.toLowerCase() === "blacklist"

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground border flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-fit">
          <Link href={`/dashboard/drivers/${driverId}`} passHref>
            <DropdownMenuItem variant="default">View Driver Details</DropdownMenuItem>
          </Link>

          <Link href={`/dashboard/drivers/update/${driverId}`} passHref>
            <DropdownMenuItem variant="default">Edit Driver</DropdownMenuItem>
          </Link>

          <DropdownMenuItem variant="default" onClick={handleDownloadQR}>
            Download QR Code
          </DropdownMenuItem>

          <DropdownMenuItem
            variant={isBlacklisted ? "default" : "destructive"}
            onClick={() => {
              setNextStatus(isBlacklisted ? "active" : "blacklist")
              setDialogOpen(true)
            }}
          >
            {isBlacklisted ? "Unblacklist Driver" : "Blacklist Driver"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {nextStatus === "blacklist" ? "Confirm Blacklisting" : "Confirm Unblacklisting"}
            </DialogTitle>
          </DialogHeader>

          <p>
            {nextStatus === "blacklist"
              ? "Are you sure you want to blacklist this driver? This action cannot be undone."
              : "Are you sure you want to unblacklist this driver and set them back to active?"}
          </p>

          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={nextStatus === "blacklist" ? "destructive" : "default"}
              onClick={handleStatusChange}
            >
              {nextStatus === "blacklist" ? "Confirm Blacklist" : "Confirm Unblacklist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
