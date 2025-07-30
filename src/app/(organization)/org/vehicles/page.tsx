import RegisteredVehicle from '@/components/customs/org-dashboard/organizations/vehicles-registry/registered-vehicle'
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Vehicles",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};
function Page() {
  return (
    <RegisteredVehicle />
  )
}

export default Page
