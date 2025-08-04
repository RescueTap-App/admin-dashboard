"use client"

import { useSearchParams } from 'next/navigation';
import StatsCard from "./stats-card";
// import TotalOrganizations from "./total-org";
import RevenueBrakedown from './total-revenue';
import VehicleRegistry from './vehicle-registry';
import OrganizationAnalytics from './org-analytics';

const stats_data = {
    totalOrganizations: {
        count: 3,
        residential: 1,
        commercial: 2,
    },
    monthlyRevenue: {
        amount: "2.4M",
        growth: "+12.5%",
    },
    vehicleSlots: {
        utilized: 1725,
        allocated: 2000,
    },
    analytics: {
        count: 3,
        operational: "66%",
    },
}
export default function Organizations() {
    const searchParams = useSearchParams();
    const activeTab = searchParams?.get('tab') ?? "organizations";

    return (
        <section>
            {/* stats cards */}
            <StatsCard data={stats_data} activeTab={activeTab} />

            <div>
                {activeTab === 'organizations' && <RevenueBrakedown />}

                {activeTab === 'revenue' && <RevenueBrakedown />}

                {activeTab === 'vehicles' && <VehicleRegistry />}

                {activeTab === 'analytics' && <OrganizationAnalytics />}

            </div>
        </section>
    )
}
