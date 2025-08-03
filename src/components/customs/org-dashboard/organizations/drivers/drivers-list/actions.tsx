import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconDotsVertical } from "@tabler/icons-react"
import Link from "next/link"
interface DriverProps {
    driverId: string
}

export function DriversActions({ driverId }: DriverProps) {
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
                        <DropdownMenuItem variant="default">Update Driver</DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
