import { ProductTable, Product } from "@/components/product-table";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    sku: "WM-001",
    category: "Electronics",
    vendor: "Tech Supplies Co",
    quantity: 150,
    reorderThreshold: 100,
    unitPrice: 25.99,
  },
  {
    id: "2",
    name: "USB Cable",
    sku: "UC-002",
    category: "Accessories",
    vendor: "Cable World",
    quantity: 45,
    reorderThreshold: 100,
    unitPrice: 9.99,
  },
  {
    id: "3",
    name: "Laptop Stand",
    sku: "LS-003",
    category: "Furniture",
    vendor: "Office Plus",
    quantity: 5,
    reorderThreshold: 50,
    unitPrice: 49.99,
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    sku: "MK-004",
    category: "Electronics",
    vendor: "Tech Supplies Co",
    quantity: 80,
    reorderThreshold: 50,
    unitPrice: 89.99,
  },
  {
    id: "5",
    name: "Monitor Arm",
    sku: "MA-005",
    category: "Furniture",
    vendor: "Office Plus",
    quantity: 25,
    reorderThreshold: 30,
    unitPrice: 129.99,
  },
  {
    id: "6",
    name: "HDMI Cable",
    sku: "HC-006",
    category: "Accessories",
    vendor: "Cable World",
    quantity: 200,
    reorderThreshold: 150,
    unitPrice: 12.99,
  },
];

export default function Products() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your product catalog and inventory
        </p>
      </div>

      <ProductTable
        products={mockProducts}
        onAdd={() => console.log("Add product clicked")}
        onEdit={(product) => console.log("Edit product", product)}
        onDelete={(product) => console.log("Delete product", product)}
      />
    </div>
  );
}
