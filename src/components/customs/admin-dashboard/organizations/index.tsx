"use client"

// import useOrganization from '@/hooks/use-organization';
import { useSearchParams } from 'next/navigation';
import OrganizationAnalytics from './org-analytics';
// import StatsCard from "./stats-card";
import Oraganizations from './total-org';
import RevenueBrakedown from './total-revenue';
import VehicleRegistry from './vehicle-registry';


export default function Organizations() {
    // const { organizations } = useOrganization({ fetchAllOrgs: true })
    const searchParams = useSearchParams();
    const activeTab = searchParams?.get('tab') ?? "organizations";
    // const stats_data = {
    //     totalOrganizations: {
    //         count: organizations?.data?.length || 0,
    //         residential: 1,
    //         commercial: 2,
    //     },
    //     monthlyRevenue: {
    //         amount: "2.4M",
    //         growth: "+12.5%",
    //     },
    //     vehicleSlots: {
    //         utilized: 1725,
    //         allocated: 2000,
    //     },
    //     analytics: {
    //         count: 3,
    //         operational: "66%",
    //     },
    // }
    return (
        <section>
            {/* stats cards */}
            {/* <StatsCard data={stats_data} activeTab={activeTab} /> */}

            <div>
                {activeTab === 'organizations' && <Oraganizations />}

                {activeTab === 'revenue' && <RevenueBrakedown />}

                {activeTab === 'vehicles' && <VehicleRegistry />}

                {activeTab === 'analytics' && <OrganizationAnalytics />}

            </div>
        </section>
    )
}
