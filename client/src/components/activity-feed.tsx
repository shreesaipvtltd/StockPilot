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
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[260px] pr-3">
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = iconMap[activity.type];
              const colorClass = colorMap[activity.type];
              
              return (
                <div key={activity.id} className="flex gap-2" data-testid={`activity-${activity.id}`}>
                  <div className={`h-7 w-7 rounded-full bg-card flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{activity.description}</p>
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
