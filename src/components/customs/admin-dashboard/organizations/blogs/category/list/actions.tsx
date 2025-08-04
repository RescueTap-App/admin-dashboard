import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconDotsVertical } from "@tabler/icons-react"
import useBlogs from "@/hooks/use-blogs"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HiOutlineDocumentMinus } from "react-icons/hi2"
import EditCategory from "../edit"


interface Props {
    categoryId: string
}

export function CategoryActions({ categoryId }: Props) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const { deleteCategory, deletingCategory } = useBlogs({ categoryId });

    const onDeleteInventory = async () => {
        const res = await deleteCategory(categoryId);
        if (res) {
            setOpenDelete(false)
        }
    };

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
                    <DropdownMenuItem variant="destructive" onClick={() => setTimeout(() => {
                        setOpenEdit(true)
                    }, 60)}>Edit Category</DropdownMenuItem>
                    <DropdownMenuItem variant="default" onClick={() => setTimeout(() => {
                        setOpenDelete(true)
                    }, 60)}>Delete Category</DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            <Drawer open={openEdit} onOpenChange={setOpenEdit}>
                <DrawerContent className="max-w-lg mx-auto">
                    <DrawerTitle className="sr-only">Edit Category</DrawerTitle>
                    <EditCategory categoryId={categoryId} />
                </DrawerContent>
            </Drawer>

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent>
                    <DialogHeader className={"px-2 border-b pb-2"}>
                        <DialogTitle className={"flex flex-row items-center gap-3 text-xl text-black"}>
                            <HiOutlineDocumentMinus size={30} color={"red"} /> Delete Category?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className={"text-sm font-inter text-gray-700"}>
                        Are you sure you want to delete this Category?
                        This Action is irreversible!
                    </DialogDescription>
                    <DialogFooter className="mt-4 flex flex-row justify-end">
                        <DialogClose asChild>
                            <Button variant={"outline"} className={"rounded font-inter"}>Close</Button>
                        </DialogClose>
                        <Button disabled={deletingCategory}
                            onClick={onDeleteInventory}
                            className={"bg-[#EF4136] hover:bg-[#EF4136]/50  text-white rounded font-lato"}
                        >
                            {deletingCategory ? "Deletig..." : "Delete Category"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
