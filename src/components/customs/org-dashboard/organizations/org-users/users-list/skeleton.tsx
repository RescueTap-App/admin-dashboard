import { Card } from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton"

export function OrgUsersSkeleton() {
    return (
        <Card className="rounded-sm px-3 min-w-full shadow">
            {/* Header Section */}
            <div className="flex flex-row justify-between items-center px-0 py-6">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex flex-row justify-between gap-3">
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Table Skeleton */}
            <div className="overflow-hidden border rounded-md">
                {/* Table Header */}
                <div className="bg-muted border-b">
                    <div className="grid grid-cols-11 gap-4 p-4">
                        {/* Drag handle */}
                        <div className="w-8">
                            <Skeleton className="h-4 w-4" />
                        </div>
                        {/* Checkbox */}
                        <div className="w-8">
                            <Skeleton className="h-4 w-4" />
                        </div>
                        {/* Profile */}
                        <div className="col-span-1">
                            <Skeleton className="h-4 w-16" />
                        </div>
                        {/* First Name */}
                        <div className="col-span-1">
                            <Skeleton className="h-4 w-20" />
                        </div>
                        {/* Last Name */}
                        <div className="col-span-1">
                            <Skeleton className="h-4 w-16" />
                        </div>
                        {/* Email */}
                        <div className="col-span-2">
                            <Skeleton className="h-4 w-12" />
                        </div>
                        {/* Phone */}
                        <div className="col-span-2">
                            <Skeleton className="h-4 w-16" />
                        </div>
                        {/* Address */}
                        <div className="col-span-1">
                            <Skeleton className="h-4 w-16" />
                        </div>
                        {/* Registration Date */}
                        <div className="col-span-1">
                            <Skeleton className="h-4 w-24" />
                        </div>
                        {/* Last Update */}
                        <div className="col-span-1">
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                </div>

                {/* Table Body - Multiple skeleton rows */}
                <div>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-11 gap-4 p-4 border-b last:border-b-0">
                            {/* Drag handle */}
                            <div className="w-8 flex items-center">
                                <Skeleton className="h-4 w-4" />
                            </div>
                            {/* Checkbox */}
                            <div className="w-8 flex items-center">
                                <Skeleton className="h-4 w-4" />
                            </div>
                            {/* Profile */}
                            <div className="col-span-1 flex items-center">
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </div>
                            {/* First Name */}
                            <div className="col-span-1 flex items-center">
                                <Skeleton className="h-4 w-20" />
                            </div>
                            {/* Last Name */}
                            <div className="col-span-1 flex items-center">
                                <Skeleton className="h-4 w-16" />
                            </div>
                            {/* Email */}
                            <div className="col-span-2 flex items-center">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                            {/* Phone */}
                            <div className="col-span-2 flex items-center">
                                <Skeleton className="h-4 w-24" />
                            </div>
                            {/* Address */}
                            <div className="col-span-1 flex items-center">
                                <Skeleton className="h-4 w-20" />
                            </div>
                            {/* Registration Date */}
                            <div className="col-span-1 flex items-center">
                                <Skeleton className="h-4 w-24" />
                            </div>
                            {/* Last Update */}
                            <div className="col-span-1 flex items-center">
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between px-4 pt-3">
                <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8 hidden lg:flex" />
                    </div>
                </div>
            </div>
        </Card>
    )
}
