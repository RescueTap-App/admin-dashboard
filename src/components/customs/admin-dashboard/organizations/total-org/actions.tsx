import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    IconDotsVertical,
    IconEye
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export function TotalOrgActions({ orgId }: { orgId: string }) {
    return (
        <section>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon"><IconDotsVertical /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <Link href={`/dashboard/organizations/${orgId}`}>
                        <DropdownMenuItem>
                            <IconEye className="mr-2" />
                            Manage
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        </section>
    );
}
