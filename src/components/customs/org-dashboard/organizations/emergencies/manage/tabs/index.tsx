import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CiMap } from "react-icons/ci";
import { IoListOutline } from "react-icons/io5";

interface EmergenciesTabsProps {
    activeTab: string
}

const tabs = [
    {
        id: "map-view",
        label: "Map View",
        icon: CiMap,
        path: ""
    },
    {
        id: "list-view",
        label: "List View",
        icon: IoListOutline,
        path: ""
    },
]

export function EmergenciesTabs({ activeTab }: EmergenciesTabsProps) {
    const pathname = usePathname()
    if (!pathname) {
        return null
    }
    return (
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
            <nav className="flex space-x-8 px-6 py-2 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <Link
                            key={tab.id}
                            href={`${pathname}?tab=${tab.id}`}
                            className={cn(
                                "flex items-center whitespace-nowrap gap-2 py-2 rounded px-3 font-medium text-sm transition-colors",
                                isActive
                                    ? "text-[#212121] bg-[#F1F3FF]"
                                    : "text-[#5E5E5E] hover:text-[#212121]",
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
