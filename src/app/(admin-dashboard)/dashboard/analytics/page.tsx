import { AdminDashboardAnalytics } from "@/components/customs/admin-dashboard/analytics-dashboard";

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Monitor platform statistics and emergency metrics.</p>
            </div>
            <AdminDashboardAnalytics />
        </div>
    );
}
