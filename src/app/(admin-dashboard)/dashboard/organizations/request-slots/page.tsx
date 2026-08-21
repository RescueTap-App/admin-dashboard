import { AdminSlotRequestsList } from '@/components/customs/admin-dashboard/organizations/slot-requests';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Rescue Tap | Slot Requests",
    description: "Review and manage organization requests for additional user and driver slots.",
};

export default function Page() {
    return (
        <div className="p-6">
            <AdminSlotRequestsList />
        </div>
    )
}
