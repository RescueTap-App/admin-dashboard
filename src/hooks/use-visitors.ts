import { useCancelVisitorMutation, useCheckOutVisitorMutation, useGetAllVisitorsQuery, useGetOrgVisitorsQuery, useGetTenantVisitorsQuery, useInviteVisitorMutation, useUpdateVisitorMutation, useVerifyCodeMutation } from "@/redux/features/visitors-api";
import { VisitorDataTypes } from "@/types/visitors.types";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface VisitorsProps {
    fetchAllVisitors?: boolean;
    fetchVisitor?: boolean;
    visitorId?: string;
    fetchAllTenants?: boolean;
    fetchTenant?: boolean;
    tenantId?: string;
    orgId?: string;
    meta?: {
        page: number;
        limit: number;
    }
}

export default function useVisitors({ fetchAllVisitors, fetchVisitor, meta, visitorId, fetchTenant, tenantId, orgId }: VisitorsProps) {
    // const router = useRouter();
    const [inviteVisitorMutation, { isLoading: invitingVisitor }] = useInviteVisitorMutation();
    const [verifyCodeMutation, { isLoading: verifyingCode }] = useVerifyCodeMutation();
    const [updateVisitorMutation, { isLoading: updatingVisitor }] = useUpdateVisitorMutation();
    const [cancelVisitorMutation, { isLoading: cancelingVisitor }] = useCancelVisitorMutation();
    const [checkOutVisitorMutation, { isLoading: checkingOutVisitor }] = useCheckOutVisitorMutation();

    const { data: allVisitors } = useGetAllVisitorsQuery(undefined, {
        skip: !fetchAllVisitors,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const { data: tenantVisitors } = useGetTenantVisitorsQuery(tenantId!, {
        skip: !fetchTenant || !tenantId,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const { data: visitor, isLoading: loadingVisitor } = useGetOrgVisitorsQuery({ orgId: orgId!, limit: meta?.limit || 10, page: meta?.page || 1 }, {
        skip: !fetchVisitor || !orgId,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const inviteVisitor = async (data: VisitorDataTypes, tenantId: string) => {
        try {
            const res = await inviteVisitorMutation({ data, tenantId }).unwrap();
            toast.success("Visitor invited successfully")
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to invite visitor"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const verifyCode = async (data: { code: string }) => {
        try {
            const res = await verifyCodeMutation({ data }).unwrap();
            toast.success("Code verified successfully")
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to verify code"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const updateVisitor = async (data: VisitorDataTypes) => {
        try {
            const res = await updateVisitorMutation({ data, id: visitorId }).unwrap();
            toast.success("Visitor updated successfully")
            return res;
        }
        catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to update visitor"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const cancelVisitor = async () => {
        try {
            const res = await cancelVisitorMutation({ id: visitorId }).unwrap();
            toast.success("Visitor cancelled successfully")
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to cancel visitor"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const checkOutVisitor = async () => {
        try {
            const res = await checkOutVisitorMutation({ id: visitorId }).unwrap();
            toast.success("Visitor checked out successfully")
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to check out visitor"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    return {
        allVisitors,
        tenantVisitors,
        visitor,
        loadingVisitor,
        inviteVisitor,
        invitingVisitor,
        verifyCode,
        verifyingCode,
        updateVisitor,
        updatingVisitor,
        cancelVisitor,
        cancelingVisitor,
        checkOutVisitor,
        checkingOutVisitor
    };
}