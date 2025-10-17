import { StockInForm } from "../stock-in-form";

export default function StockInFormExample() {
  return (
    <div className="p-6 max-w-2xl">
      <StockInForm onSubmit={(data) => console.log("Form submitted:", data)} />
    </div>
  );
}
