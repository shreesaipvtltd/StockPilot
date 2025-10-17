import { StockBadge } from "../stock-badge";

export default function StockBadgeExample() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <span className="text-sm w-32">Sufficient:</span>
        <StockBadge quantity={150} reorderThreshold={100} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-32">Low Stock:</span>
        <StockBadge quantity={45} reorderThreshold={100} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-32">Critical:</span>
        <StockBadge quantity={5} reorderThreshold={100} />
      </div>
    </div>
  );
}
