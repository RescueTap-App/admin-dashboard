"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useGetAllSlotRequestsQuery, useReviewSlotRequestMutation, type SlotRequest } from '@/redux/features/slot-requests-api'
import { format } from "date-fns"

export function AdminSlotRequestsList() {
    const { data: requests, isLoading, error } = useGetAllSlotRequestsQuery()
    const [reviewRequest, { isLoading: isReviewing }] = useReviewSlotRequestMutation()
    
    // Simple state to track which row is currently loading (so all buttons don't spin)
    const [activeRowId, setActiveRowId] = useState<string | null>(null)

    const handleReview = async (id: string, status: "approved" | "rejected") => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) return
        
        setActiveRowId(id)
        try {
            await reviewRequest({ id, status }).unwrap()
            toast.success(`Request ${status} successfully`)
        } catch (err: any) {
            toast.error(err?.data?.message || `Failed to ${status} request`)
        } finally {
            setActiveRowId(null)
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Slot Requests</CardTitle>
                    <CardDescription>Loading requests...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Slot Requests</CardTitle>
                    <CardDescription className="text-red-500">Failed to load requests.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Organization Slot Requests</CardTitle>
                <CardDescription>Review and manage requests for additional user and driver slots.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Requester</TableHead>
                            <TableHead>Requested Slots</TableHead>
                            <TableHead>Urgency</TableHead>
                            <TableHead>Justification</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests && requests.length > 0 ? (
                            requests.map((request: SlotRequest) => {
                                const orgName = typeof request.organizationId === 'string' 
                                    ? request.organizationId 
                                    : request.organizationId?.organizationName || "Unknown"
                                    
                                const isRowLoading = isReviewing && activeRowId === request._id

                                return (
                                    <TableRow key={request._id}>
                                        <TableCell className="font-medium">{orgName}</TableCell>
                                        <TableCell>{request.requesterName}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>Users: <span className="font-semibold">{request.additionalUserSlots}</span></div>
                                                <div>Drivers: <span className="font-semibold">{request.additionalDriverSlots}</span></div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                request.urgency === 'urgent' ? 'destructive' :
                                                request.urgency === 'high' ? 'destructive' :
                                                request.urgency === 'medium' ? 'secondary' : 'outline'
                                            } className="capitalize">
                                                {request.urgency}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={request.justification}>
                                            {request.justification}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                request.status === 'approved' ? 'default' :
                                                request.status === 'rejected' ? 'destructive' : 'secondary'
                                            } className={request.status === 'approved' ? 'bg-green-600' : ''}>
                                                {request.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {request.createdAt ? format(new Date(request.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {request.status === 'pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                                        disabled={isRowLoading}
                                                        onClick={() => handleReview(request._id, 'approved')}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                                        disabled={isRowLoading}
                                                        onClick={() => handleReview(request._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Processed</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                    No slot requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
