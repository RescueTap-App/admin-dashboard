"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { IoMdTrash } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { format } from "date-fns";
import {
  createTipCategorySchema,
  CreateTipCategorySchemaType,
} from "@/constants/validations/blogs";
import {
  useGetTipCategoriesQuery,
  useCreateTipCategoryMutation,
  useUpdateTipCategoryMutation,
  useDeleteTipCategoryMutation,
  type TipCategory,
} from "@/redux/features/blogs-api";

function TipCategoriesPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | null>(null);

  // Queries and mutations
  const { data: categories = [], isLoading } = useGetTipCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateTipCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateTipCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteTipCategoryMutation();

  // Create form
  const createForm = useForm<CreateTipCategorySchemaType>({
    resolver: zodResolver(createTipCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Edit form
  const editForm = useForm<CreateTipCategorySchemaType>({
    resolver: zodResolver(createTipCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleCreateSubmit = async (data: CreateTipCategorySchemaType) => {
    try {
      await createCategory(data).unwrap();
      toast.success("Tip category created successfully");
      setOpenCreate(false);
      createForm.reset();
    } catch (error) {
      toast.error("Failed to create tip category");
      console.error(error);
    }
  };

  const handleEditSubmit = async (data: CreateTipCategorySchemaType) => {
    if (!selectedCategory) return;
    try {
      await updateCategory({ id: selectedCategory._id, data }).unwrap();
      toast.success("Tip category updated successfully");
      setOpenEdit(false);
      setSelectedCategory(null);
      editForm.reset();
    } catch (error) {
      toast.error("Failed to update tip category");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success("Tip category deleted successfully");
      setOpenDelete(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error("Failed to delete tip category");
      console.error(error);
    }
  };

  const openEditDialog = (category: TipCategory) => {
    setSelectedCategory(category);
    editForm.reset({
      name: category.name,
      description: category.description,
    });
    setOpenEdit(true);
  };

  const openDeleteDialog = (category: TipCategory) => {
    setSelectedCategory(category);
    setOpenDelete(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Tip Categories</CardTitle>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="bg-[#EF4136] hover:bg-[#EF4136]/90">
                <IconPlus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Tip Category</DialogTitle>
                <DialogDescription>
                  Add a new category for tips
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create Category"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading categories...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No tip categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {format(new Date(category.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <IoEllipsisVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(category)}
                              className="cursor-pointer"
                            >
                              <IconPencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(category)}
                              className="cursor-pointer text-red-600"
                            >
                              <IoMdTrash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tip Category</DialogTitle>
            <DialogDescription>
              Update the tip category details
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tip Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete `{selectedCategory?.name}` ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TipCategoriesPage;