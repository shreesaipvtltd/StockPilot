import { ProductTable, Product } from "../product-table";

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
