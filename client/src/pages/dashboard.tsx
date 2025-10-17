import { Package, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/stat-card";
import { ActivityFeed } from "@/components/activity-feed";
import { LowStockAlert } from "@/components/low-stock-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  totalStockValue: number;
  activeUsers: number;
}

interface CategoryData {
  category: string;
  value: number;
}

interface Activity {
  id: string;
  type: 'stock-in' | 'stock-out' | 'approval' | 'rejection';
  user: string;
  timestamp: string;
  description: string;
}

export default function Dashboard() {
  const { data: dashboardStats, isLoading: loadingStats } = useQuery<DashboardStats>({
    queryKey: ['/api/analytics/dashboard'],
  });

  const { data: stockInData, isLoading: loadingStockIn } = useQuery<CategoryData[]>({
    queryKey: ['/api/analytics/stock-in-by-category'],
  });

  const { data: stockOutData, isLoading: loadingStockOut } = useQuery<CategoryData[]>({
    queryKey: ['/api/analytics/stock-out-by-category'],
  });

  const { data: recentActivity, isLoading: loadingActivity } = useQuery<Activity[]>({
    queryKey: ['/api/analytics/recent-activity'],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time overview of your inventory
        </p>
      </div>

      {loadingStats ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        dashboardStats && dashboardStats.lowStockCount > 0 && (
          <LowStockAlert 
            count={dashboardStats.lowStockCount} 
            onViewDetails={() => window.location.href = '/products?filter=low-stock'} 
          />
        )
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {loadingStats ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={dashboardStats?.totalProducts?.toLocaleString() || "0"}
              icon={Package}
            />
            <StatCard
              title="Low Stock Alerts"
              value={dashboardStats?.lowStockCount?.toString() || "0"}
              icon={AlertTriangle}
              iconColor="text-chart-3"
            />
            <StatCard
              title="Stock Value"
              value={formatCurrency(dashboardStats?.totalStockValue || 0)}
              icon={TrendingUp}
              iconColor="text-chart-2"
            />
            <StatCard
              title="Active Users"
              value={dashboardStats?.activeUsers?.toString() || "0"}
              icon={Users}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Stock In by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStockIn ? (
              <Skeleton className="h-[280px]" />
            ) : stockInData && stockInData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stockInData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockInData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                No stock in data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Stock Out by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStockOut ? (
              <Skeleton className="h-[280px]" />
            ) : stockOutData && stockOutData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stockOutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockOutData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                No stock out data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingActivity ? (
              <div className="space-y-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : recentActivity && recentActivity.length > 0 ? (
              <ActivityFeed activities={recentActivity} />
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
