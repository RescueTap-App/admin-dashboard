import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/custom-base-query';
import { DriverRegistrationData } from '@/types/drivers.types';
import { OrganizationRegistrationData, OrgUserInviteData } from '@/types/organization.types';

export const organizationApi = createApi({
    reducerPath: 'organizationApi',
    baseQuery: customBaseQueryWithReauth,
    tagTypes: ['Drivers', 'Users', 'Organization'],
    endpoints: (builder) => ({
        createOrganization: builder.mutation({
            query: ({ data }: { data: OrganizationRegistrationData }) => ({
                url: '/users/register-organization',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Organization'],
        }),
        getOrgs: builder.query({
            query: () => `/users/fetch/organizations`,
            providesTags: ['Organization'],
        }),
        getOrgById: builder.query({
            query: (id: string) => `/users/${id}`,
            providesTags: ['Organization'],
        }),
        inviteOrgUser: builder.mutation({
            query: ({ data, inviterId }: { data: OrgUserInviteData; inviterId: string }) => ({
                url: `/users/member/invite/${inviterId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        bulkOrgUpload: builder.mutation({
            query: ({ formData, adminId, countryCode }: { formData: FormData; adminId: string; countryCode: string }) => ({
                url: `/users/organization/${adminId}/invite/bulk/${countryCode}`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Users'],
        }),
        getOrgDrivers: builder.query({
            query: (inviterId: string) => `/users/organization/${inviterId}/drivers`,
            providesTags: ['Drivers'],
        }),
        getOrgUsers: builder.query({
            query: (inviterId: string) => `/users/organization/${inviterId}/users`,
            providesTags: ['Users'],
        }),
        registerDriver: builder.mutation({
            query: ({ data, inviterId }: { data: DriverRegistrationData; inviterId: string }) => ({
                url: `users/${inviterId}/drivers`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Drivers'],
        }),
        getallDrivers: builder.query({
            query: () => `/users/getAllDrivers`,
            providesTags: ['Drivers'],
        }),
    }),
});

export const {
    useCreateOrganizationMutation,
    useInviteOrgUserMutation,
    useBulkOrgUploadMutation,
    useGetOrgDriversQuery,
    useGetOrgUsersQuery,
    useRegisterDriverMutation,
    useGetallDriversQuery,
    useGetOrgsQuery,
    useGetOrgByIdQuery
} = organizationApi;
