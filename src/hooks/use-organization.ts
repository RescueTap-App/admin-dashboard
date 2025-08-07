"use client"

import {
    useCreateOrganizationMutation,
    useInviteOrgUserMutation,
    useBulkOrgUploadMutation,
    useGetOrgDriversQuery,
    useGetOrgUsersQuery,
    useRegisterDriverMutation,
    useGetallDriversQuery,
    useGetOrgsQuery,
    useGetOrgByIdQuery
} from "@/redux/features/organization-api";
import { toast } from "sonner";
import { OrganizationRegistrationData, OrgUserInviteData } from '@/types/organization.types';
import { DriverRegistrationData } from '@/types/drivers.types';
import { useRouter } from "next/navigation";

interface OrgProps {
    fetchAllUsers?: boolean;
    fetchAllDrivers?: boolean;
    inviterId?: string;
    orgId?: string;
    fetchAllOrgs?: boolean,
}

export default function useOrganization({ fetchAllUsers, fetchAllDrivers, fetchAllOrgs, inviterId, orgId }: OrgProps) {
    const router = useRouter();
    const { data: allDrivers, isLoading: loadingDrivers } = useGetallDriversQuery(undefined, {
        skip: !fetchAllDrivers,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const { data: orgUsers } = useGetOrgUsersQuery(inviterId!, {
        skip: !fetchAllUsers || !inviterId,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const { data: orgDrivers } = useGetOrgDriversQuery(inviterId!, {
        skip: !fetchAllUsers || !inviterId,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const { data: organizations } = useGetOrgsQuery(undefined, {
        skip: !fetchAllOrgs,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const { data: singleOrganization } = useGetOrgByIdQuery(orgId!, {
        skip: !fetchAllOrgs || !orgId,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const [createOrganizationMutation, { isLoading: creating }] = useCreateOrganizationMutation();
    const [inviteOrgUserMutation, { isLoading: inviting }] = useInviteOrgUserMutation();
    const [bulkOrgUploadMutation, { isLoading: uploading }] = useBulkOrgUploadMutation();
    const [registerDriverMutation, { isLoading: registring }] = useRegisterDriverMutation();


    const createOrganization = async (data: OrganizationRegistrationData) => {
        try {
            const res = await createOrganizationMutation({ data }).unwrap();
            if (res) {
                toast.success("Organization created successfully");
                router.push("/dashboard/organizations")
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to create organization"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const inviteOrgUser = async (data: OrgUserInviteData, inviterId: string) => {
        try {
            const res = await inviteOrgUserMutation({ data, inviterId }).unwrap();
            if (res) {
                toast.success("User invited successfully");
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to invite user"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const bulkOrgUpload = async (formData: FormData, adminId: string) => {
        try {
            const res = await bulkOrgUploadMutation({ formData, adminId }).unwrap();
            if (res.status === "success") {
                toast.success(res.message || "Bulk upload successful");
            } else {
                toast.message(`${res.message} or we found a duplicate credentials`)
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Bulk upload failed"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const registerDriver = async (payload: DriverRegistrationData, inviterId: string) => {
        try {
            const res = await registerDriverMutation({ data: payload, inviterId }).unwrap();
            if (res) {
                toast.success("Driver registered successfully");
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Driver registration failed"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    return {
        createOrganization,
        creating,
        inviteOrgUser,
        inviting,
        bulkOrgUpload,
        uploading,
        registerDriver,
        registring,

        // Queries
        allDrivers,
        organizations,
        singleOrganization,
        loadingDrivers,
        orgUsers,
        orgDrivers
    };
}
