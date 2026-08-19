"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserListType } from "@/types/users.types"
import { IconDotsVertical } from "@tabler/icons-react"

type UsersActionsProps = {
  user: UserListType
}

/**
 * Row actions for the super-admin users list.
 * "Upgrade to organization" is UI-only for now — API wiring comes later.
 */
export function UsersActions({ user }: UsersActionsProps) {
  const canUpgrade =
    user.role === "user" && user.userType !== "organization"

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu for {user.firstName} {user.lastName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {/* <DropdownMenuItem
            disabled={!canUpgrade}
            onSelect={(event) => {
              // Placeholder until the upgrade endpoint is ready.
              event.preventDefault()
            }}
          >
            Upgrade to organization
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" disabled>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
