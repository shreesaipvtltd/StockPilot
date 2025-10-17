import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface LowStockAlertProps {
  count: number;
  onViewDetails?: () => void;
}

export function LowStockAlert({ count, onViewDetails }: LowStockAlertProps) {
  if (count === 0) return null;

  return (
    <Alert className="border-chart-3 bg-chart-3/10" data-testid="alert-low-stock">
      <AlertTriangle className="h-4 w-4 text-chart-3" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="text-sm">
          <strong>{count}</strong> {count === 1 ? 'product is' : 'products are'} running low on stock
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="border-chart-3 text-chart-3 hover:bg-chart-3/20"
          data-testid="button-view-low-stock"
        >
          View Details
        </Button>
      </AlertDescription>
    </Alert>
  );
}
