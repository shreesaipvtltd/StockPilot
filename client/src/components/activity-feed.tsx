import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownToLine, ArrowUpFromLine, CheckCircle, XCircle } from "lucide-react";

interface Activity {
  id: string;
  type: "stock-in" | "stock-out" | "approval" | "rejection";
  user: string;
  product?: string;
  quantity?: number;
  timestamp: string;
  description: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const iconMap = {
  "stock-in": ArrowDownToLine,
  "stock-out": ArrowUpFromLine,
  "approval": CheckCircle,
  "rejection": XCircle,
};

const colorMap = {
  "stock-in": "text-chart-2",
  "stock-out": "text-primary",
  "approval": "text-chart-2",
  "rejection": "text-chart-4",
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = iconMap[activity.type];
              const colorClass = colorMap[activity.type];
              
              return (
                <div key={activity.id} className="flex gap-3" data-testid={`activity-${activity.id}`}>
                  <div className={`h-8 w-8 rounded-full bg-card flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.user} • {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
