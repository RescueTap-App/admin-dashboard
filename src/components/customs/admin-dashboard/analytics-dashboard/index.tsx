"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import useAnalytics from "@/hooks/use-analytics"
import { Badge } from "@/components/ui/badge"
import {
  IconTrendingUp,
  IconAlertTriangle,
  IconClock,
  IconUsers,
  IconMapPin,
} from "@tabler/icons-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const COLORS = ['#EF4136', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#00BCD4']
const SEVERITY_COLORS: Record<string, string> = {
  Critical: '#EF4136',
  High: '#FF9800',
  Medium: '#FFC107',
  Low: '#4CAF50',
}

export function AdminDashboardAnalytics() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month')
  const [emergencyType, setEmergencyType] = useState<string>('all')

  const {
    dashboardData,
    loadingDashboard,
    voiceNotesData,
    loadingVoiceNotes,
    liveLocationData,
    loadingLiveLocation,
    kpisData,
    loadingKPIs,
  } = useAnalytics({
    fetchDashboard: true,
    fetchVoiceNotes: true,
    fetchLiveLocation: true,
    fetchKPIs: true,
    dateRange,
    emergencyFilters: { type: emergencyType === 'all' ? undefined : emergencyType },
  })

  const isLoading =
    loadingDashboard || loadingVoiceNotes || loadingLiveLocation || loadingKPIs

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  // KPI Cards
  const emergencyTrendPercent = kpisData?.emergencyPercentageChange || 0
  const trendDirection = emergencyTrendPercent >= 0 ? 'up' : 'down'
  const trendColor = emergencyTrendPercent >= 0 ? 'text-red-600' : 'text-green-600'

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={dateRange} onValueChange={(value: "week" | "month" | "year") => setDateRange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={emergencyType} onValueChange={setEmergencyType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Emergency type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Fire">Fire</SelectItem>
            <SelectItem value="Accident">Accident</SelectItem>
            <SelectItem value="Crime">Crime</SelectItem>
            <SelectItem value="Medical">Medical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Emergencies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Emergencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {kpisData?.totalEmergenciesThisMonth || 0}
                </p>
                <p className={`text-xs font-semibold ${trendColor}`}>
                  {trendDirection === 'up' ? '↑' : '↓'} {Math.abs(
                    kpisData?.emergencyPercentageChange || 0
                  )}% vs last month
                </p>
              </div>
              {/* <IconAlertTriangle className="size-8 text-red-500" /> */}
            </div>
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {kpisData?.averageResponseTime || 0}
                </p>
                <p className="text-xs text-muted-foreground">minutes</p>
              </div>
              {/* <IconClock className="size-8 text-blue-500" /> */}
            </div>
          </CardContent>
        </Card>

        {/* Active Voice Notes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Voice Notes Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {voiceNotesData?.dailyCount || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  Avg duration: {voiceNotesData?.averageDuration?.toFixed(1) || 0}s
                </p>
              </div>
              {/* <IconTrendingUp className="size-8 text-green-500" /> */}
            </div>
          </CardContent>
        </Card>

        {/* Active Location Sharing */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Live Tracking Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {liveLocationData?.activeUsers || 0}
                </p>
                <p className="text-xs text-muted-foreground">currently active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Emergencies by Type */}
        {kpisData?.emergenciesByType && kpisData.emergenciesByType.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emergencies by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={kpisData.emergenciesByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      label={({ type, value }: any) => `${type}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {kpisData.emergenciesByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergencies by Severity */}
        {kpisData?.emergenciesBySeverity && kpisData.emergenciesBySeverity.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emergencies by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpisData.emergenciesBySeverity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="severity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#EF4136">
                      {kpisData.emergenciesBySeverity.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SEVERITY_COLORS[entry.severity] || '#8884d8'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Active Users per Region */}
        {kpisData?.activeUsersPerRegion && kpisData.activeUsersPerRegion.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Users per Region</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpisData.activeUsersPerRegion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2196F3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Organizations */}
        {kpisData?.mostActiveOrganizations && kpisData.mostActiveOrganizations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {kpisData.mostActiveOrganizations.slice(0, 5).map((org, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="h-8 w-8 flex items-center justify-center rounded-full">
                        {idx + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{org.name}</p>
                      </div>
                    </div>
                    <p className="font-bold">{org.emergencies}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Voice Notes Analytics */}
      {voiceNotesData && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Voice Note Topics */}
          {voiceNotesData.topTopics && voiceNotesData.topTopics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Common Voice Note Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {voiceNotesData.topTopics.map((topic, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <p className="text-sm font-medium">{topic.topic}</p>
                      <Badge variant="outline">{topic.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Voice Note Users */}
          {voiceNotesData.topUsers && voiceNotesData.topUsers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Active Voice Note Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {voiceNotesData.topUsers.slice(0, 5).map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <p className="text-sm font-mono">{user.userId.substring(0, 8)}...</p>
                      <Badge className="bg-blue-600">{user.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Live Location Analytics */}
      {liveLocationData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live Location Sharing Insights</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Avg Session Duration
              </p>
              <p className="mt-2 text-2xl font-bold">
                {liveLocationData.averageSessionDuration?.toFixed(1) || 0}
              </p>
              <p className="text-xs text-muted-foreground">minutes</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Emergency-Triggered Sessions
              </p>
              <p className="mt-2 text-2xl font-bold">
                {liveLocationData.emergencyTriggeredSessions || 0}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium text-muted-foreground">Peak Hour</p>
              <p className="mt-2 text-2xl font-bold">
                {liveLocationData.peakHours?.[0]?.hour || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Peak Hours Chart */}
      {liveLocationData?.peakHours && liveLocationData.peakHours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location Sharing Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveLocationData.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#00BCD4"
                    strokeWidth={2}
                    dot={{ fill: '#00BCD4', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
