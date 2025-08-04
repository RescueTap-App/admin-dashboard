import CategoryList from "@/components/customs/admin-dashboard/organizations/blogs/category/list";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Blog Categories",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

export default function Page() {
    return (
        <CategoryList />
    )
}
