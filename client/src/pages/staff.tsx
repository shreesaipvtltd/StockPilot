import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface StaffMember {
  id: string;
  name: string;
  role: "admin" | "manager" | "staff" | "employee";
  email: string;
  tasksCompleted: number;
  efficiency: number;
  status: "active" | "inactive";
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Manager",
    role: "manager",
    email: "sarah.m@company.com",
    tasksCompleted: 145,
    efficiency: 95,
    status: "active",
  },
  {
    id: "2",
    name: "John Doe",
    role: "staff",
    email: "john.d@company.com",
    tasksCompleted: 234,
    efficiency: 88,
    status: "active",
  },
  {
    id: "3",
    name: "Alice Worker",
    role: "staff",
    email: "alice.w@company.com",
    tasksCompleted: 198,
    efficiency: 92,
    status: "active",
  },
  {
    id: "4",
    name: "Mike Wilson",
    role: "employee",
    email: "mike.w@company.com",
    tasksCompleted: 67,
    efficiency: 78,
    status: "active",
  },
];

const roleColors = {
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  manager: "bg-primary/10 text-primary border-primary/20",
  staff: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  employee: "bg-muted text-muted-foreground border-muted",
};

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = mockStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage warehouse personnel and track performance
          </p>
        </div>
        <Button data-testid="button-add-staff">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
          data-testid="input-search-staff"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} data-testid={`card-staff-${staff.id}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-medium flex-shrink-0">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{staff.name}</h3>
                      <Badge variant="outline" className={roleColors[staff.role]}>
                        {staff.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{staff.email}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tasks: </span>
                        <span className="font-medium">{staff.tasksCompleted}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Efficiency: </span>
                        <span className="font-medium">{staff.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log("Edit staff:", staff)}
                    data-testid={`button-edit-staff-${staff.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log("Delete staff:", staff)}
                    data-testid={`button-delete-staff-${staff.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
