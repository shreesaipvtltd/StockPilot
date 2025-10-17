import { useState } from "react";
import { ProductTable, Product } from "@/components/product-table";
import { ProductForm } from "@/components/product-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    sku: "WM-001",
    category: "Electronics",
    vendor: "Tech Supplies Co",
    quantity: 150,
    totalQuantity: 200,
    reorderThreshold: 100,
    costPrice: 18.99,
    sellingPrice: 25.99,
  },
  {
    id: "2",
    name: "USB Cable",
    sku: "UC-002",
    category: "Accessories",
    vendor: "Cable World",
    quantity: 45,
    totalQuantity: 150,
    reorderThreshold: 100,
    costPrice: 5.99,
    sellingPrice: 9.99,
  },
  {
    id: "3",
    name: "Laptop Stand",
    sku: "LS-003",
    category: "Furniture",
    vendor: "Office Plus",
    quantity: 5,
    totalQuantity: 50,
    reorderThreshold: 50,
    costPrice: 35.99,
    sellingPrice: 49.99,
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    sku: "MK-004",
    category: "Electronics",
    vendor: "Tech Supplies Co",
    quantity: 80,
    totalQuantity: 120,
    reorderThreshold: 50,
    costPrice: 65.99,
    sellingPrice: 89.99,
  },
  {
    id: "5",
    name: "Monitor Arm",
    sku: "MA-005",
    category: "Furniture",
    vendor: "Office Plus",
    quantity: 25,
    totalQuantity: 60,
    reorderThreshold: 30,
    costPrice: 95.99,
    sellingPrice: 129.99,
  },
  {
    id: "6",
    name: "HDMI Cable",
    sku: "HC-006",
    category: "Accessories",
    vendor: "Cable World",
    quantity: 200,
    totalQuantity: 300,
    reorderThreshold: 150,
    costPrice: 8.99,
    sellingPrice: 12.99,
  },
];

export default function Products() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your product catalog and inventory
        </p>
      </div>

      <ProductTable
        products={mockProducts}
        onAdd={() => setShowForm(true)}
        onEdit={(product) => console.log("Edit product", product)}
        onDelete={(product) => console.log("Delete product", product)}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={(data) => {
              console.log("Product added:", data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
