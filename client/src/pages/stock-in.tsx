import { StockInForm } from "@/components/stock-in-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownToLine } from "lucide-react";

const recentStockIns = [
  { id: "1", product: "Wireless Mouse", quantity: 50, supplier: "Tech Supplies Co", date: "2024-01-15", time: "14:30" },
  { id: "2", product: "USB Cable", quantity: 100, supplier: "Cable World", date: "2024-01-15", time: "11:20" },
  { id: "3", product: "Laptop Stand", quantity: 30, supplier: "Office Plus", date: "2024-01-14", time: "16:45" },
  { id: "4", product: "HDMI Cable", quantity: 75, supplier: "Cable World", date: "2024-01-14", time: "09:15" },
];

export default function StockIn() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Stock In</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Log incoming inventory and update stock levels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <StockInForm onSubmit={(data) => console.log("Stock in submitted:", data)} />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Stock Ins</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-3">
              <div className="space-y-3">
                {recentStockIns.map((item) => (
                  <div key={item.id} className="flex gap-2 pb-3 border-b last:border-0" data-testid={`stock-in-${item.id}`}>
                    <div className="h-8 w-8 rounded-md bg-chart-2/10 flex items-center justify-center text-chart-2 flex-shrink-0">
                      <ArrowDownToLine className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs">{item.product}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        +{item.quantity} units from {item.supplier}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.date} at {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
