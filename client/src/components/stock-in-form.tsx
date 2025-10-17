import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface StockInFormProps {
  onSubmit?: (data: any) => void;
}

export function StockInForm({ onSubmit }: StockInFormProps) {
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    supplier: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    console.log("Stock-in submitted:", formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Stock In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
              <SelectTrigger id="product" data-testid="select-product">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wireless-mouse">Wireless Mouse</SelectItem>
                <SelectItem value="usb-cable">USB Cable</SelectItem>
                <SelectItem value="laptop-stand">Laptop Stand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                data-testid="input-quantity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                placeholder="Enter supplier name"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                data-testid="input-supplier"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              data-testid="input-notes"
            />
          </div>

          <div className="space-y-2">
            <Label>Invoice Attachment (Optional)</Label>
            <div className="border-2 border-dashed rounded-md p-6 text-center hover-elevate">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, PNG, JPG up to 10MB
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" data-testid="button-submit-stock-in">
              Log Stock In
            </Button>
            <Button type="button" variant="outline" className="flex-1" data-testid="button-cancel">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
