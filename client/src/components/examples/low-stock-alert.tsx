import { LowStockAlert } from "../low-stock-alert";

export default function LowStockAlertExample() {
  return (
    <div className="p-6 space-y-4">
      <LowStockAlert count={23} onViewDetails={() => console.log("View details clicked")} />
      <LowStockAlert count={1} onViewDetails={() => console.log("View details clicked")} />
    </div>
  );
}
