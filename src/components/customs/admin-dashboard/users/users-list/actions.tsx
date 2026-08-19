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
import { useDeleteUserMutation } from "@/redux/features/users-api"
import { toast } from "sonner"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type UsersActionsProps = {
  user: UserListType
}

/**
 * Row actions for the super-admin users list.
 * "Upgrade to organization" is UI-only for now — API wiring comes later.
 */
export function UsersActions({ user }: UsersActionsProps) {
  // const canUpgrade =
  //   user.role === "user" && user.userType !== "organization"
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <IconDotsVertical />
            )}
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
          <DropdownMenuItem
            variant="destructive"
            disabled={isDeleting}
            onSelect={(e) => {
              e.preventDefault()
              setShowDeleteDialog(true)
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm this Action
            </AlertDialogTitle>
            <AlertDialogDescription>
              Clicking confirm will permanently delete <span className="font-semibold text-red-600">{user.firstName} {user.lastName}</span> and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel</AlertDialogCancel>

            <AlertDialogAction disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white" onClick={async (clickEvent) => {
              clickEvent.preventDefault()
              try {
                await deleteUser(user._id).unwrap()
                toast.success("User deleted successfully")
                setShowDeleteDialog(false)
              } catch (error: any) {
                toast.error(error?.data?.message || "Failed to delete user")
              }
            }}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

      </AlertDialog>
    </div>
  )
}
