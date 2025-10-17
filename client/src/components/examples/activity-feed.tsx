import { ActivityFeed } from "../activity-feed";

const mockActivities = [
  {
    id: "1",
    type: "stock-in" as const,
    user: "John Doe",
    product: "Laptop",
    quantity: 50,
    timestamp: "2 minutes ago",
    description: "Added 50 units of Laptop",
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
    product: "Mouse",
    quantity: 20,
    timestamp: "1 hour ago",
    description: "Fulfilled 20 units of Mouse",
  },
  {
    id: "4",
    type: "rejection" as const,
    user: "Sarah Manager",
    timestamp: "2 hours ago",
    description: "Rejected stock request #1230",
  },
];

export default function ActivityFeedExample() {
  return (
    <div className="p-6 max-w-md">
      <ActivityFeed activities={mockActivities} />
    </div>
  );
}
