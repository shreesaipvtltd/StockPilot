import { ReportFilters } from "../report-filters";

export default function ReportFiltersExample() {
  return (
    <div className="p-6 max-w-md">
      <ReportFilters onGenerate={(filters) => console.log("Filters:", filters)} />
    </div>
  );
}
