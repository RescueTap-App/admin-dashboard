import { toast } from "sonner";
import { useGetallDriversQuery, useGetaDriverQuery, useCreateDriverMutation, useUpdateDriverMutation } from "@/redux/features/drivers-api"
import { useRouter } from "next/navigation";
import { CreateDriverFormData, UpdateDriverFormData } from "@/constants/validations/drivers";

interface DriverProps {
    fetchAllDrivers?: boolean;
    fetchADriver?: boolean;
    driverId?: string;
}

export default function useDrivers({ fetchAllDrivers, fetchADriver, driverId }: DriverProps) {
    
    const router = useRouter();
    const [createDriverMutation, { isLoading: creating }] = useCreateDriverMutation();
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

    const createDriver = async (data: CreateDriverFormData) => {
        try {
            const res = await createDriverMutation({ data }).unwrap();
            if (res) {
                toast.success("Driver created successfully");
                router.push("/dasboard/drivers")
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
        all_drivers,
        loadingDrivers,
        driver,
        loadingDriver,
        createDriver,
        creating,
        updateDriver,
        updating
    }
}
