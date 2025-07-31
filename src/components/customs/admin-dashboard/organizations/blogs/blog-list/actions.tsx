import useBlogs from "@/hooks/use-blogs"
import { Key, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconPencil } from "@tabler/icons-react";
import { IoMdTrash } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { HiOutlineDocumentMinus } from "react-icons/hi2";


interface BlogProps {
    blogId: string
    categoryId?: string[]
}
export function BlobActions({ blogId }: BlogProps) {
    const [open, setOpen] = useState(false);
    const { deleteBlog, deletingBlog } = useBlogs({ blogId });


    const onDeleteInventory = async () => {
        const res = await deleteBlog(blogId);
        if (res) {
            setOpen(false)
        }
    };


    const handleDialogTrigger = (open: boolean) => {
        setTimeout(() => {
            setOpen(open)
        }, 60)
    }
    return (
        <div className="flex items-center justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button onClick={() => {
                        // Close dropdown before opening dialog
                        setTimeout(() => setOpen(true), 50);
                    }} className="rounded border border-[#D0D3D9] px-2 py-1.5 cursor-pointer text-[#5D6679] w-fit flex flex-row items-center gap-2">
                        <IoEllipsisVertical className="h-5 w-5" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-md">
                    <DropdownMenuItem className="text-green-500 cursor-pointer">
                        <IconPencil className="h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDialogTrigger(true)} className="text-red-500 cursor-pointer">
                        <IoMdTrash className="h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogOverlay className="bg-[#1E272E70] backdrop-blur-sm" />
                <DialogContent className={""}>
                    <DialogHeader className={"px-2 border-b"}>
                        <DialogTitle className={"flex flex-row items-center gap-3 text-xl text-black"}><HiOutlineDocumentMinus size={30} color={"red"} /> Delete Blog?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className={"text-sm font-inter text-gray-700"}>
                        Are you sure you want to delete this Blog?
                        This Action is irreversible!
                    </DialogDescription>
                    <DialogFooter className="mt-4 flex flex-row justify-end">
                        <DialogClose asChild>
                            <Button variant={"outline"} className={"rounded font-inter"}>Close</Button>
                        </DialogClose>
                        <Button disabled={deletingBlog}
                            onClick={onDeleteInventory}
                            className={"bg-[#EF4136] hover:bg-[#EF4136]/50  text-white rounded font-lato"}
                        >
                            {deletingBlog ? "Deletig..." : "Delete Blog"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export function BlogCategory({ categoryId }: Pick<BlogProps, "categoryId">) {
    const { all_categories } = useBlogs({ fetchAllCategories: true });

    const blogCategories = all_categories?.filter((cat: { _id: string; }) => categoryId?.includes(cat._id)) || [];

    return (
        <div className="flex flex-wrap gap-1.5">
            {blogCategories.map((cat: { _id: Key | null | undefined; name: string }) => (
                <span key={cat._id} className="text-sm font-medium bg-gray-100 px-2 py-1 capitalize rounded">
                    {cat.name}
                </span>
            ))}
        </div>
    );
}
