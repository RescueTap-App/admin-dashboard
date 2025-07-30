import { useGetUsersQuery, useCreateUserMutation } from "@/redux/features/users-api"
import { CreateUserFormData } from "@/constants/validations/register-user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UsersProps {
    fetchAllUsers?: boolean
}
export default function useUsers({ fetchAllUsers }: UsersProps) {

    const router = useRouter();
    const [createUserMutation, { isLoading: creating }] = useCreateUserMutation();
    const { data: all_users, isLoading: loading_users } = useGetUsersQuery(undefined, {
        skip: !fetchAllUsers,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })

    const createUser = async (data: CreateUserFormData) => {
        try {
            const res = await createUserMutation({ data }).unwrap();
            toast.success("User created successfully");
            router.push("/dashboard/users")
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to create user"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    return {
        all_users,
        loading_users,
        createUser,
        creating
    }
}
