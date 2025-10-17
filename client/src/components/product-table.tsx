import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { StockBadge } from "./stock-badge";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  vendor: string;
  quantity: number;
  totalQuantity: number;
  reorderThreshold: number;
  costPrice: number;
  sellingPrice: number;
}

interface ProductTableProps {
  products: Product[];
  onAdd?: () => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductTable({ products, onAdd, onEdit, onDelete }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle>Products</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-products"
              />
            </div>
            <Button onClick={onAdd} data-testid="button-add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">SKU</th>
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Vendor</th>
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Available</th>
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Total Qty</th>
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Cost Price</th>
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Selling Price</th>
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Stock Status</th>
                <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover-elevate" data-testid={`row-product-${product.id}`}>
                  <td className="px-4 py-2">
                    <p className="font-medium text-sm">{product.name}</p>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{product.sku}</td>
                  <td className="px-4 py-2 text-xs">{product.category}</td>
                  <td className="px-4 py-2 text-xs">{product.vendor}</td>
                  <td className="px-4 py-2 text-sm font-medium">{product.quantity}</td>
                  <td className="px-4 py-2 text-sm font-medium">{product.totalQuantity}</td>
                  <td className="px-4 py-2 text-sm font-medium">${product.costPrice}</td>
                  <td className="px-4 py-2 text-sm font-medium">${product.sellingPrice}</td>
                  <td className="px-4 py-2">
                    <StockBadge quantity={product.quantity} reorderThreshold={product.reorderThreshold} />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(product)}
                        data-testid={`button-edit-${product.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete?.(product)}
                        data-testid={`button-delete-${product.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
