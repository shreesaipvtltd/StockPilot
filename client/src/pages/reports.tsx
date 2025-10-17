import { ReportFilters } from "@/components/report-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingDown, BarChart3, Package } from "lucide-react";

const reportTypes = [
  {
    id: "current-stock",
    title: "Current Stock Report",
    description: "Snapshot of all inventory quantities by category",
    icon: Package,
    color: "text-primary",
  },
  {
    id: "low-stock",
    title: "Low Stock Report",
    description: "Items below reorder threshold",
    icon: TrendingDown,
    color: "text-chart-3",
  },
  {
    id: "stock-movement",
    title: "Stock Movement History",
    description: "Detailed log of all stock-in and stock-out transactions",
    icon: BarChart3,
    color: "text-chart-2",
  },
  {
    id: "usage",
    title: "Usage Report",
    description: "Inventory usage by project or department",
    icon: FileText,
    color: "text-chart-1",
  },
];

export default function Reports() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate analytical reports for inventory insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.id} className="hover-elevate cursor-pointer" data-testid={`card-report-${report.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-md bg-card flex items-center justify-center ${report.color} flex-shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-0.5">{report.title}</h3>
                        <p className="text-xs text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <ReportFilters onGenerate={(filters) => console.log("Generate report:", filters)} />
      </div>
    </div>
  );
}
