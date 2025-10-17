import { Package, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { ActivityFeed } from "@/components/activity-feed";
import { LowStockAlert } from "@/components/low-stock-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const mockActivities = [
  {
    id: "1",
    type: "stock-in" as const,
    user: "John Doe",
    timestamp: "2 minutes ago",
    description: "Added 50 units of Wireless Mouse",
  },
  {
    id: "2",
    type: "approval" as const,
    user: "Sarah Manager",
    timestamp: "15 minutes ago",
    description: "Approved stock request #1234",
  },
  {
    id: "3",
    type: "stock-out" as const,
    user: "Mike Staff",
    timestamp: "1 hour ago",
    description: "Fulfilled 20 units of USB Cable",
  },
  {
    id: "4",
    type: "rejection" as const,
    user: "Sarah Manager",
    timestamp: "2 hours ago",
    description: "Rejected stock request #1230",
  },
  {
    id: "5",
    type: "stock-in" as const,
    user: "Alice Worker",
    timestamp: "3 hours ago",
    description: "Added 100 units of Laptop Stand",
  },
];

const chartData = [
  { month: "Jan", stockIn: 400, stockOut: 240 },
  { month: "Feb", stockIn: 300, stockOut: 139 },
  { month: "Mar", stockIn: 200, stockOut: 980 },
  { month: "Apr", stockIn: 278, stockOut: 390 },
  { month: "May", stockIn: 189, stockOut: 480 },
  { month: "Jun", stockIn: 239, stockOut: 380 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time overview of your inventory
        </p>
      </div>

      <LowStockAlert count={23} onViewDetails={() => console.log("View low stock products")} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value="1,234"
          icon={Package}
          trend={{ value: "12% from last month", isPositive: true }}
        />
        <StatCard
          title="Low Stock Alerts"
          value="23"
          icon={AlertTriangle}
          iconColor="text-chart-3"
        />
        <StatCard
          title="Stock Value"
          value="$125,430"
          icon={TrendingUp}
          trend={{ value: "8% from last month", isPositive: true }}
          iconColor="text-chart-2"
        />
        <StatCard
          title="Active Staff"
          value="42"
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Stock Movement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="stockIn" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stockOut" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <ActivityFeed activities={mockActivities} />
      </div>
    </div>
  );
}
