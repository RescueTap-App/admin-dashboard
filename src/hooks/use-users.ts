import { useGetUsersQuery } from "@/redux/features/users-api"

interface UsersProps {
    fetchAllUsers: boolean
}
export default function useUsers({ fetchAllUsers }: UsersProps) {
    
    const { data: all_users, isLoading: loading_users } = useGetUsersQuery(undefined, {
        skip: !fetchAllUsers,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })



    return {
        all_users,
        loading_users
    }
}
