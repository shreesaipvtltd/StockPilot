import { StatCard } from "../stat-card";
import { Package, AlertTriangle, TrendingUp, Users } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
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
  );
}
