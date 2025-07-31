import { toast } from "sonner";
import { DriverRegistrationData } from '@/types/drivers.types';
import { useGetallDriversQuery, useGetaDriverQuery, useCreateDriverMutation, useUpdateDriverMutation } from "@/redux/features/drivers-api"

interface DriverProps {
    fetchAllDrivers?: boolean;
    fetchADriver?: boolean;
    driverId?: string;
}

export default function useDrivers({ fetchAllDrivers, fetchADriver, driverId }: DriverProps) {

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

    const createDriver = async (data: DriverRegistrationData) => {
        try {
            const res = await createDriverMutation({ data }).unwrap();
            if (res) {
                toast.success("Driver created successfully");
            }
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to create driver"
            toast.error(errorMessage)
            console.log(error)
        }
    };

    const updateDriver = async (data: DriverRegistrationData) => {
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
