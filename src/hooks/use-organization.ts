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
    useGetOrgByIdQuery,
    useGetAnalyticsQuery,
    useRequestSlotsMutation,
    // useGetSlotsRequestsQuery,
    // useGetASlotRequestQuery
} from "@/redux/features/organization-api";
import { toast } from "sonner";
import { OrganizationRegistrationData, OrgUserInviteData } from '@/types/organization.types';
import { DriverRegistrationData } from '@/types/drivers.types';
import { useRouter } from "next/navigation";
import { SlotRequestFormData } from "@/constants/validations/register-vehicle";

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

    const { data: analytics } = useGetAnalyticsQuery(undefined, {
        skip: !fetchAllOrgs,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const [createOrganizationMutation, { isLoading: creating }] = useCreateOrganizationMutation();
    const [inviteOrgUserMutation, { isLoading: inviting }] = useInviteOrgUserMutation();
    const [bulkOrgUploadMutation, { isLoading: uploading }] = useBulkOrgUploadMutation();
    const [registerDriverMutation, { isLoading: registring }] = useRegisterDriverMutation();
    const [requestSlotsMutation, { isLoading: requesting }] = useRequestSlotsMutation();

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

    const bulkOrgUpload = async (formData: FormData, adminId: string, countryCode: string) => {
        try {
            const res = await bulkOrgUploadMutation({ formData, adminId, countryCode }).unwrap();

            if (res.status === "success") {
                toast.success(res.message || "Bulk upload successful");
            } else {
                // If backend responds with errors array
                if (res.errors && Array.isArray(res.errors)) {
                    const errorList = res.errors
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .map((e: any) => `${e.email || e.phoneNumber}: ${e.errors.join(", ")}`)
                        .join("\n");

                    toast.info(errorList); // show all errors
                } else {
                    toast.error(res.message || "Bulk upload failed");
                }
            }

            return res;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const backendError = error?.data;

            if (backendError?.errors && Array.isArray(backendError.errors)) {
                const errorList = backendError.errors
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((e: any) => `${e.email || e.phoneNumber}: ${e.errors.join(", ")}`)
                    .join("\n");

                toast.info(errorList);
            } else {
                const errorMessage = backendError?.message || "Bulk upload failed";
                toast.error(errorMessage);
            }

            console.log(error);
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


    const requestSlots = async (data: SlotRequestFormData) => {
        try {
            const res = await requestSlotsMutation({ data }).unwrap();
            if (res) {
                toast.success("Slots requested successfully");
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to request slots"
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
        orgDrivers,
        analytics,
        requestSlots,
        requesting
    };
}
