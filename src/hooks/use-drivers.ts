import { toast } from "sonner";
import {
    useGetallDriversQuery,
    useGetaDriverQuery,
    useGetallTravelsQuery,
    useCreateDriverAdminMutation,
    useUpdateDriverStatusMutation,
    useCreateDriverMutation,
    useUpdateDriverMutation
} from "@/redux/features/drivers-api"
import { useRouter } from "next/navigation";
import { CreateDriverFormData, UpdateDriverFormData } from "@/constants/validations/drivers";

interface DriverProps {
    fetchAllDrivers?: boolean;
    fetchADriver?: boolean;
    fetchTravels?: boolean;
    driverId?: string;
}

export default function useDrivers({ fetchAllDrivers, fetchTravels, fetchADriver, driverId }: DriverProps) {

    const router = useRouter();
    const [createDriverMutation, { isLoading: creating }] = useCreateDriverMutation();
    const [createAdminDriverMutation, { isLoading: creatingDriverAdmin }] = useCreateDriverAdminMutation()
    const [updateDriverStatus, { isLoading: updatingStatus }] = useUpdateDriverStatusMutation()
    const [updateDriverMutation, { isLoading: updating }] = useUpdateDriverMutation();


    const { data: all_drivers, isLoading: loadingDrivers } = useGetallDriversQuery(undefined, {
        skip: !fetchAllDrivers,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const { data: driver, isLoading: loadingDriver } = useGetaDriverQuery(driverId!, {
        skip: !fetchADriver || !driverId,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const { data: travels, isLoading: loadingTravels } = useGetallTravelsQuery(undefined, {
        skip: !fetchTravels,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    const createDriver = async (data: CreateDriverFormData, inviterId: string) => {
        try {
            const res = await createDriverMutation({ data, inviterId }).unwrap();
            if (res) {
                toast.success("Driver created successfully");
                router.push("/org/drivers")
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to create driver"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const updateStatus = async (data: { status: string }) => {
        try {
            const res = await updateDriverStatus({ data, id: driverId }).unwrap();
            if (res) {
                toast.success("Driver Blicklisted");
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to blacklist driver"
            toast.error(errorMessage)
            console.log(error)
        }
    };
    const createDriverAdmin = async (data: CreateDriverFormData) => {
        try {
            const res = await createAdminDriverMutation({ data }).unwrap();
            if (res) {
                toast.success("Driver created successfully");
                router.push("/dashboard/drivers")
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to create driver"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const updateDriver = async (data: UpdateDriverFormData) => {
        try {
            const res = await updateDriverMutation({ id: driverId, data }).unwrap();
            if (res) {
                toast.success("Driver updated successfully");
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to update driver details"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    return {
        travels,
        loadingTravels,
        all_drivers,
        loadingDrivers,
        driver,
        loadingDriver,
        createDriver,
        creating,
        updateDriver,
        updating,
        updateStatus,
        updatingStatus,
        createDriverAdmin,
        creatingDriverAdmin
    }
}
