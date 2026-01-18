"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { format } from 'date-fns';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconUser,
    IconShieldCheck,
    IconSteeringWheel,
    IconGripVertical,
    IconCircleCheckFilled,
    IconInfoCircle,
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { UserListType } from "@/types/users.types"
import SearchInput from "@/components/shared/search-input";
import Image from "next/image"
import { UsersActions } from "./actions";


function DragHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({
        id,
    })

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent"
        >
            <IconGripVertical className="text-muted-foreground size-4" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

const columns: ColumnDef<UserListType>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original._id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "profileImage",
        header: "Profile",
        cell: ({ row }) => (
            <div className="w-10 h-10 relative">
                <Image src={row.original.profileImage || "/icons/avatar.svg"}
                    alt={"Profile Image"}
                    fill
                    fetchPriority="high"
                    className={"object-contain object-center border rounded-full border-orange-600/50"} />
            </div>
        ),
    },
    {
        accessorKey: "firstName",
        header: "Name",
        cell: ({ row }) => (
            <div className="max-w-32 flex flex-col gap-1">
                <h1 className="text-muted-foreground font-semibold px-1.5 font-lato">
                    {row.original.firstName}
                </h1>
                <h1 className="text-muted-foreground font-semibold px-1.5 font-lato">{row.original.lastName}</h1>
                <h1 className="text-muted-foreground px-1.5 font-lato">{row.original.email}</h1>
            </div>
        ),
    },
    {
        accessorKey: "hasActiveSubscription",
        header: "User Type",
        cell: ({ row }) => (
            <Badge variant="outline" className={`text-muted-foreground px-1.5 flex flex-row items-center capitalize ${row.original.verified ? "text-green-500 dark:text-green-400" : "text-amber-500 dark:text-amber-400"}`}>
                {row.original.hasActiveSubscription ? (
                    <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                ) : (
                    <IconInfoCircle className={"fill-amber-500 text-white"} />
                )}
                {row.original.hasActiveSubscription ? "Active" : "Unsubscribed"}
            </Badge>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Registration Date",
        cell: ({ row }) => (
            <div className="w-32">
                <p className="text-muted-foreground px-1.5 font-lato">
                    {format(new Date(row.original.createdAt), 'MMM d, yyyy')}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "updatedAt",
        header: "Last Update",
        cell: ({ row }) => (
            <div className="w-32">
                <p className="text-muted-foreground px-1.5 font-lato">
                    {format(new Date(row.original.updatedAt), 'MMM d, yyyy')}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "verified",
        header: "Verified",
        cell: ({ row }) => (
            <Badge variant="outline" className={`text-muted-foreground px-1.5 flex flex-row items-center capitalize ${row.original.verified ? "text-green-500 dark:text-green-400" : "text-amber-500 dark:text-amber-400"}`}>
                {row.original.verified ? (
                    <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                ) : (
                    <IconInfoCircle className={"fill-amber-500 text-white"} />
                )}
                {row.original.verified ? "Verified" : "Unverified"}
            </Badge>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role;

            let icon;
            let color;

            switch (role) {
                case "admin":
                    icon = <IconShieldCheck className="fill-blue-500 dark:fill-blue-400 mr-1" />;
                    color = "text-blue-500 dark:text-blue-400";
                    break;
                case "driver":
                    icon = <IconSteeringWheel className="fill-yellow-500 dark:fill-yellow-400 mr-1" />;
                    color = "text-yellow-500 dark:text-yellow-400";
                    break;
                case "user":
                default:
                    icon = <IconUser className="fill-gray-500 dark:fill-gray-300 mr-1" />;
                    color = "text-muted-foreground";
                    break;
            }

            return (
                <Badge variant="outline" className={`px-1.5 ${color} flex items-center gap-1`}>
                    {icon}
                    <span className="capitalize">{role}</span>
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: () => (
            <UsersActions />
        ),
    },
]

function DraggableRow({ row }: { row: Row<UserListType> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original._id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function UsersListTable({
    data: initialData,
}: {
    data: UserListType[]
}) {
    const [data, setData] = React.useState(() => initialData)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 5,
    })
    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({ _id }) => _id) || [],
        [data]
    )

    React.useEffect(() => {
        if (initialData?.length) {
            setData(initialData);
        }
    }, [initialData]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            globalFilter,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row._id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    return (
        <React.Fragment>
            <div className="flex items-center gap-3 mb-4">
                <SearchInput
                    value={globalFilter}
                    placeholder={"users"}
                    onChange={(e) => setGlobalFilter(e.target.value)} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="default" className={"rounded"}>
                            {/* <IconLayoutColumns /> */}
                            <span className="hidden lg:inline">All Roles</span>
                            <span className="lg:hidden">Roles</span>
                            <IconChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) =>
                                    typeof column.accessorFn !== "undefined" &&
                                    column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden border">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                >
                    <SortableContext
                        items={dataIds}
                        strategy={verticalListSortingStrategy}
                    >

                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan} className="font-nunito">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map(row => (
                                        <DraggableRow key={row.id} row={row} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </SortableContext>
                </DndContext>
            </div>
            <div className="flex items-center justify-between px-4 pt-3">
                <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows per page
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
