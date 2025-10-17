import { RequestCard, StockRequest } from "../request-card";

const mockRequests: StockRequest[] = [
  {
    id: "1",
    requester: "John Smith",
    product: "Wireless Mouse",
    quantity: 10,
    purpose: "Office Setup",
    status: "pending",
    requestedAt: "2 hours ago",
  },
  {
    id: "2",
    requester: "Sarah Jones",
    product: "USB Cable",
    quantity: 25,
    purpose: "IT Department",
    status: "approved",
    requestedAt: "5 hours ago",
  },
  {
    id: "3",
    requester: "Mike Wilson",
    product: "Laptop Stand",
    quantity: 5,
    purpose: "Remote Workers",
    status: "rejected",
    requestedAt: "1 day ago",
  },
];

export default function RequestCardExample() {
  return (
    <div className="p-6 space-y-4 max-w-2xl">
      {mockRequests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          showActions={request.status === "pending"}
          onApprove={(req) => console.log("Approved:", req)}
          onReject={(req) => console.log("Rejected:", req)}
        />
      ))}
    </div>
  );
}
