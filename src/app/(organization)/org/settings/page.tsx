import { Metadata } from "next";
import { IoSettingsOutline } from "react-icons/io5";


export const metadata: Metadata = {
    title: "Rescue Tap | Settings",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

function Page() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <IoSettingsOutline className="text-4xl animate-spin duration-300" />
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-gray-500">Manage your settings and preferences</p>
        </div>
    )
}

export default Page
