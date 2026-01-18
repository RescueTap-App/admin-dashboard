import { Card } from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton"

export function VisitorsLogSkeleton() {
    return (
        <section className="mt-1 flex flex-col gap-5">
            {/* Statistics Cards Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="rounded shadow flex flex-row justify-between items-center p-4">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex justify-start">
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Main Content Card */}
            <Card className="rounded mt-5 px-3 min-w-full shadow">
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
                </div>

                {/* Table Skeleton */}
                <div className="overflow-hidden border rounded-md">
                    {/* Table Header */}
                    <div className="bg-muted border-b">
                        <div className="grid grid-cols-12 gap-4 p-4">
                            {/* Drag handle */}
                            <div className="w-8">
                                <Skeleton className="h-4 w-4" />
                            </div>
                            {/* Checkbox */}
                            <div className="w-8">
                                <Skeleton className="h-4 w-4" />
                            </div>
                            {/* Visitor Name */}
                            <div className="col-span-2">
                                <Skeleton className="h-4 w-20" />
                            </div>
                            {/* Phone */}
                            <div className="col-span-2">
                                <Skeleton className="h-4 w-16" />
                            </div>
                            {/* Purpose */}
                            <div className="col-span-2">
                                <Skeleton className="h-4 w-16" />
                            </div>
                            {/* Vehicle Number */}
                            <div className="col-span-1">
                                <Skeleton className="h-4 w-20" />
                            </div>
                            {/* No Visitors */}
                            <div className="col-span-1">
                                <Skeleton className="h-4 w-16" />
                            </div>
                            {/* Status */}
                            <div className="col-span-1">
                                <Skeleton className="h-4 w-12" />
                            </div>
                            {/* Check-In Time */}
                            <div className="col-span-1">
                                <Skeleton className="h-4 w-20" />
                            </div>
                            {/* Check-Out Time */}
                            <div className="col-span-1">
                                <Skeleton className="h-4 w-20" />
                            </div>
                            {/* Actions */}
                            <div className="w-16">
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    </div>

                    {/* Table Body - Multiple skeleton rows */}
                    <div>
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0">
                                {/* Drag handle */}
                                <div className="w-8 flex items-center">
                                    <Skeleton className="h-4 w-4" />
                                </div>
                                {/* Checkbox */}
                                <div className="w-8 flex items-center">
                                    <Skeleton className="h-4 w-4" />
                                </div>
                                {/* Visitor Name */}
                                <div className="col-span-2 flex items-center">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                {/* Phone */}
                                <div className="col-span-2 flex items-center">
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                {/* Purpose */}
                                <div className="col-span-2 flex items-center">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                                {/* Vehicle Number */}
                                <div className="col-span-1 flex items-center">
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                {/* No Visitors */}
                                <div className="col-span-1 flex items-center">
                                    <Skeleton className="h-6 w-12 rounded-full" />
                                </div>
                                {/* Status */}
                                <div className="col-span-1 flex items-center">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                                {/* Check-In Time */}
                                <div className="col-span-1 flex items-center">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                {/* Check-Out Time */}
                                <div className="col-span-1 flex items-center">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                {/* Actions */}
                                <div className="w-16 flex items-center">
                                    <Skeleton className="h-8 w-8 rounded" />
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
        </section>
    )
}
