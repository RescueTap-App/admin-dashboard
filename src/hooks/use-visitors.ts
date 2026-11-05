import {
  useCancelVisitorMutation,
  useCheckOutVisitorMutation,
  useGetAllVisitorsQuery,
  useGetOrgVisitorsQuery,
  useGetTenantVisitorsQuery,
  useInviteVisitorMutation,
  useUpdateVisitorMutation,
  useVerifyCodeMutation,
  visitorsApi,
} from "@/redux/features/visitors-api"
import type { AppDispatch } from "@/lib/store"
import { useDispatch } from "react-redux"
import type {
  ActiveVisitorsLogTableTypes,
  VisitorDataTypes,
} from "@/types/visitors.types"
import { useCallback } from "react"
import { toast } from "sonner"

interface VisitorsProps {
  fetchAllVisitors?: boolean
  fetchVisitor?: boolean
  visitorId?: string
  fetchAllTenants?: boolean
  fetchTenant?: boolean
  tenantId?: string
  orgId?: string
  meta?: {
    page: number
    limit: number
  }
}

const PAGE_SIZE = 100

export default function useVisitors({
  fetchAllVisitors,
  fetchVisitor,
  meta,
  visitorId,
  fetchTenant,
  tenantId,
  orgId,
}: VisitorsProps) {
  const [inviteVisitorMutation, { isLoading: invitingVisitor }] =
    useInviteVisitorMutation()
  const [verifyCodeMutation, { isLoading: verifyingCode }] =
    useVerifyCodeMutation()
  const [updateVisitorMutation, { isLoading: updatingVisitor }] =
    useUpdateVisitorMutation()
  const [cancelVisitorMutation, { isLoading: cancelingVisitor }] =
    useCancelVisitorMutation()
  const [checkOutVisitorMutation, { isLoading: checkingOutVisitor }] =
    useCheckOutVisitorMutation()
  const dispatch = useDispatch<AppDispatch>()

  const { data: allVisitors } = useGetAllVisitorsQuery(undefined, {
    skip: !fetchAllVisitors,
  })
  const { data: tenantVisitors } = useGetTenantVisitorsQuery(tenantId!, {
    skip: !fetchTenant || !tenantId,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })
  const { data: visitor, isLoading: loadingVisitor } = useGetOrgVisitorsQuery(
    {
      orgId: orgId!,
      limit: meta?.limit || 10,
      page: meta?.page || 1,
    },
    {
      skip: !fetchVisitor || !orgId,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  )

  /**
   * Loads every org visitor (for the date filter / CSV). The first page tells
   * us how many pages exist; the rest are fetched in parallel. Rows are
   * de-duplicated by id, since records created mid-fetch can shift across pages.
   */
  const fetchAllOrgVisitors = useCallback(
    async (organizationId: string): Promise<ActiveVisitorsLogTableTypes[]> => {
      const fetchPage = async (page: number) => {
        const sub = dispatch(
          visitorsApi.endpoints.getOrgVisitors.initiate(
            { orgId: organizationId, page, limit: PAGE_SIZE },
            { forceRefetch: true },
          ),
        )
        try {
          return await sub.unwrap()
        } finally {
          sub.unsubscribe()
        }
      }

      const first = await fetchPage(1)
      const totalPages = first.pagination?.totalPages ?? 1

      const rest = await Promise.all(
        Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) =>
          fetchPage(i + 2),
        ),
      )

      const byId = new Map<string, ActiveVisitorsLogTableTypes>()
      for (const res of [first, ...rest]) {
        for (const row of res.visitors || []) byId.set(String(row._id), row)
      }
      return Array.from(byId.values())
    },
    [dispatch],
  )

  const inviteVisitor = async (data: VisitorDataTypes, inviteTenantId: string) => {
    try {
      const res = await inviteVisitorMutation({
        data,
        tenantId: inviteTenantId,
      }).unwrap()
      toast.success("Visitor invited successfully")
      return res
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message: string } })?.data?.message ||
        "Failed to invite visitor"
      toast.error(errorMessage)
      console.log(error)
    }
  }

  const verifyCode = async (data: { code: string }) => {
    try {
      const res = await verifyCodeMutation({ data: { ...data, tenantId: orgId! } }).unwrap()
      toast.success("Code verified successfully")
      return res
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message: string } })?.data?.message ||
        "Failed to verify code"
      toast.error(errorMessage)
      console.log(error)
    }
  }

  const updateVisitor = async (data: VisitorDataTypes) => {
    try {
      const res = await updateVisitorMutation({
        data,
        id: visitorId,
      }).unwrap()
      toast.success("Visitor updated successfully")
      return res
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message: string } })?.data?.message ||
        "Failed to update visitor"
      toast.error(errorMessage)
      console.log(error)
    }
  }

  const cancelVisitor = async () => {
    try {
      const res = await cancelVisitorMutation({ id: visitorId }).unwrap()
      toast.success("Visitor cancelled successfully")
      return res
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message: string } })?.data?.message ||
        "Failed to cancel visitor"
      toast.error(errorMessage)
      console.log(error)
    }
  }

  const checkOutVisitor = async () => {
    try {
      const res = await checkOutVisitorMutation({ id: visitorId }).unwrap()
      toast.success("Visitor checked out successfully")
      return res
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message: string } })?.data?.message ||
        "Failed to check out visitor"
      toast.error(errorMessage)
      console.log(error)
    }
  }

  return {
    allVisitors,
    tenantVisitors,
    visitor,
    loadingVisitor,
    fetchAllOrgVisitors,
    inviteVisitor,
    invitingVisitor,
    verifyCode,
    verifyingCode,
    updateVisitor,
    updatingVisitor,
    cancelVisitor,
    cancelingVisitor,
    checkOutVisitor,
    checkingOutVisitor,
  }
}
