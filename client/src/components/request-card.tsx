import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export interface StockRequest {
  id: string;
  requester: string;
  product: string;
  quantity: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  requestedAt: string;
}

interface RequestCardProps {
  request: StockRequest;
  onApprove?: (request: StockRequest) => void;
  onReject?: (request: StockRequest) => void;
  showActions?: boolean;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-chart-3/10 text-chart-3 border-chart-3/20", icon: Clock },
  approved: { label: "Approved", color: "bg-chart-2/10 text-chart-2 border-chart-2/20", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-chart-4/10 text-chart-4 border-chart-4/20", icon: XCircle },
  fulfilled: { label: "Fulfilled", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
};

export function RequestCard({ request, onApprove, onReject, showActions = false }: RequestCardProps) {
  const config = statusConfig[request.status];
  const StatusIcon = config.icon;

  return (
    <Card data-testid={`card-request-${request.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">{request.product}</h4>
              <Badge variant="outline" className={config.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Requester: <span className="text-foreground">{request.requester}</span></p>
              <p>Quantity: <span className="text-foreground font-medium">{request.quantity} units</span></p>
              <p>Purpose: <span className="text-foreground">{request.purpose}</span></p>
              <p className="text-xs">{request.requestedAt}</p>
            </div>
          </div>
        </div>
        
        {showActions && request.status === "pending" && (
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              onClick={() => onApprove?.(request)}
              className="flex-1"
              data-testid={`button-approve-${request.id}`}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject?.(request)}
              className="flex-1"
              data-testid={`button-reject-${request.id}`}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
