import { ProductTable, Product } from "../product-table";

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
];

export default function ProductTableExample() {
  return (
    <div className="p-6">
      <ProductTable
        products={mockProducts}
        onAdd={() => console.log("Add product clicked")}
        onEdit={(product) => console.log("Edit product", product)}
        onDelete={(product) => console.log("Delete product", product)}
      />
    </div>
  );
}
