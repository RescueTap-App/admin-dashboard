import CreateBlogs from "@/components/customs/admin-dashboard/organizations/blogs/create";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Create Blog",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

function Page() {
    return (
        <CreateBlogs />
    )
}

export default Page
