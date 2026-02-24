"use client";

import useBlogs from "@/hooks/use-blogs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconPencil } from "@tabler/icons-react";
import { IoMdTrash } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { HiOutlineDocumentMinus } from "react-icons/hi2";
import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Form } from "@/components/ui/form";
import {
  createTipSchema,
  CreateTipSchemaType,
} from "@/constants/validations/blogs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface TipProps {
  id: string;
  content: string;
}
export function TipActions({ id, content }: TipProps) {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { deleteTips, deletingTips, updateTips, editingTips } = useBlogs({});

  const onDeleteTip = async () => {
    const res = await deleteTips(id);
    if (res) {
      setOpen(false);
    }
  };

  const handleDialogTrigger = (open: boolean) => {
    setTimeout(() => {
      setOpen(open);
    }, 60);
  };

  const form = useForm<CreateTipSchemaType>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      content: content || "",
    },
  });

  useEffect(() => {
    form.reset({ content });
  }, [content, form]);

const handleSubmit = async (formData: CreateTipSchemaType) => {
  const res = await updateTips(id, formData.content);
  if (res) {
    form.reset(formData); // ✅ immediately reflect updated text
    setOpenEdit(false); // ✅ close modal after saving
  }
};


  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={() => {
              setTimeout(() => setOpen(true), 50);
            }}
            className="rounded border border-[#D0D3D9] px-2 py-1.5 cursor-pointer text-[#5D6679] w-fit flex flex-row items-center gap-2"
          >
            <IoEllipsisVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-md">
          <DropdownMenuItem
            className="text-green-500 cursor-pointer"
            onClick={() =>
              setTimeout(() => {
                setOpenEdit(true);
              }, 60)
            }
          >
            <IconPencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDialogTrigger(true)}
            className="text-red-500 cursor-pointer"
          >
            <IoMdTrash className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="bg-[#1E272E70] backdrop-blur-sm" />
        <DialogContent>
          <DialogHeader className={"px-2 border-b pb-2"}>
            <DialogTitle
              className={"flex flex-row items-center gap-3 text-xl text-black"}
            >
              <HiOutlineDocumentMinus size={30} color={"red"} /> Delete Tip?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className={"text-sm font-inter text-gray-700"}>
            Are you sure you want to delete this Tip? This Action is
            irreversible!
          </DialogDescription>
          <DialogFooter className="mt-4 flex flex-row justify-end">
            <DialogClose asChild>
              <Button variant={"outline"} className={"rounded font-inter"}>
                Close
              </Button>
            </DialogClose>
            <Button
              disabled={deletingTips}
              onClick={onDeleteTip}
              className={
                "bg-[#EF4136] hover:bg-[#EF4136]/50  text-white rounded font-lato"
              }
            >
              {deletingTips ? "Deleting..." : "Delete Tip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogOverlay className="bg-[#1E272E70] backdrop-blur-sm" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit this Tips</DialogTitle>
            <DialogDescription>
              Make some changes to this tip and save it
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <ReusableFormField
                control={form.control}
                name="content"
                fieldType="textarea"
                className="h-20 text-sm rounded"
                placeholder="Stay hydrated and rest well"
              />
              <DialogFooter className={"flex flex-row justify-end"}>
                <Button
                  disabled={editingTips}
                  type="submit"
                  className="max-w-md rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3"
                >
                  {editingTips ? "Processing..." : " Edit Tip"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
