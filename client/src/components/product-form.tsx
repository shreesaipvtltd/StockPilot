import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    vendor: "",
    quantity: "",
    totalQuantity: "",
    reorderThreshold: "",
    costPrice: "",
    sellingPrice: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    console.log("Product submitted:", formData);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-product-name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sku" className="text-xs">SKU *</Label>
              <Input
                id="sku"
                placeholder="Enter SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                data-testid="input-sku"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="office-supplies">Office Supplies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vendor" className="text-xs">Vendor *</Label>
              <Input
                id="vendor"
                placeholder="Enter vendor name"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                data-testid="input-vendor"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quantity" className="text-xs">Available Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                data-testid="input-quantity"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="totalQuantity" className="text-xs">Total Quantity *</Label>
              <Input
                id="totalQuantity"
                type="number"
                placeholder="0"
                value={formData.totalQuantity}
                onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                data-testid="input-total-quantity"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reorderThreshold" className="text-xs">Reorder Threshold *</Label>
              <Input
                id="reorderThreshold"
                type="number"
                placeholder="0"
                value={formData.reorderThreshold}
                onChange={(e) => setFormData({ ...formData, reorderThreshold: e.target.value })}
                data-testid="input-reorder-threshold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="costPrice" className="text-xs">Cost Price *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                data-testid="input-cost-price"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sellingPrice" className="text-xs">Selling Price *</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                data-testid="input-selling-price"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add product description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              data-testid="input-description"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1" data-testid="button-submit-product">
              Add Product
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel} data-testid="button-cancel">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
