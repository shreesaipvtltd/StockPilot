import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileDown } from "lucide-react";

interface ReportFiltersProps {
  onGenerate?: (filters: any) => void;
}

export function ReportFilters({ onGenerate }: ReportFiltersProps) {
  const handleGenerate = () => {
    const filters = {
      type: (document.getElementById("report-type") as HTMLInputElement)?.value,
      dateFrom: (document.getElementById("date-from") as HTMLInputElement)?.value,
      dateTo: (document.getElementById("date-to") as HTMLInputElement)?.value,
      category: (document.getElementById("category") as HTMLInputElement)?.value,
    };
    onGenerate?.(filters);
    console.log("Generate report with filters:", filters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select defaultValue="current-stock">
            <SelectTrigger id="report-type" data-testid="select-report-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-stock">Current Stock Report</SelectItem>
              <SelectItem value="low-stock">Low Stock Report</SelectItem>
              <SelectItem value="stock-movement">Stock Movement History</SelectItem>
              <SelectItem value="usage">Usage Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-from">From Date</Label>
            <Input type="date" id="date-from" data-testid="input-date-from" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-to">To Date</Label>
            <Input type="date" id="date-to" data-testid="input-date-to" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select defaultValue="all">
            <SelectTrigger id="category" data-testid="select-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleGenerate} className="w-full" data-testid="button-generate-report">
          <FileDown className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
}
