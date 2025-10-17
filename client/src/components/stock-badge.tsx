import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface StockBadgeProps {
  quantity: number;
  reorderThreshold: number;
}

export function StockBadge({ quantity, reorderThreshold }: StockBadgeProps) {
  const percentage = (quantity / reorderThreshold) * 100;
  
  if (quantity >= reorderThreshold) {
    return (
      <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20" data-testid="badge-stock-sufficient">
        In Stock ({quantity})
      </Badge>
    );
  }
  
  if (percentage >= 10 && percentage < 100) {
    return (
      <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20" data-testid="badge-stock-low">
        Low Stock ({quantity})
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20" data-testid="badge-stock-critical">
      <AlertTriangle className="h-3 w-3 mr-1" />
      Critical ({quantity})
    </Badge>
  );
}
