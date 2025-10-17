import { useState } from "react";
import { RequestCard, StockRequest } from "@/components/request-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

const mockRequests: StockRequest[] = [
  {
    id: "1",
    requester: "John Smith",
    product: "Wireless Mouse",
    quantity: 10,
    purpose: "Office Setup - New Hires",
    status: "pending",
    requestedAt: "2 hours ago",
  },
  {
    id: "2",
    requester: "Emily Chen",
    product: "USB Cable",
    quantity: 15,
    purpose: "IT Department - Workstation Upgrades",
    status: "pending",
    requestedAt: "4 hours ago",
  },
  {
    id: "3",
    requester: "Sarah Jones",
    product: "USB Cable",
    quantity: 25,
    purpose: "IT Department",
    status: "approved",
    requestedAt: "5 hours ago",
  },
  {
    id: "4",
    requester: "Mike Wilson",
    product: "Laptop Stand",
    quantity: 5,
    purpose: "Remote Workers",
    status: "rejected",
    requestedAt: "1 day ago",
  },
  {
    id: "5",
    requester: "David Lee",
    product: "HDMI Cable",
    quantity: 20,
    purpose: "Conference Rooms",
    status: "fulfilled",
    requestedAt: "2 days ago",
  },
];

export default function StockOut() {
  const [requests, setRequests] = useState(mockRequests);

  const handleApprove = (request: StockRequest) => {
    setRequests(prev => prev.map(r => 
      r.id === request.id ? { ...r, status: "approved" as const } : r
    ));
    console.log("Approved request:", request);
  };

  const handleReject = (request: StockRequest) => {
    setRequests(prev => prev.map(r => 
      r.id === request.id ? { ...r, status: "rejected" as const } : r
    ));
    console.log("Rejected request:", request);
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const approvedRequests = requests.filter(r => r.status === "approved");
  const allRequests = requests;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Stock Out Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and approve stock out requests
          </p>
        </div>
        <Button data-testid="button-new-request">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-3">
        <TabsList>
          <TabsTrigger value="pending" data-testid="tab-pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved" data-testid="tab-approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="all" data-testid="tab-all">
            All Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No pending requests
            </div>
          ) : (
            pendingRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                showActions
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-3">
          {approvedRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No approved requests
            </div>
          ) : (
            approvedRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3">
          {allRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              showActions={request.status === "pending"}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
