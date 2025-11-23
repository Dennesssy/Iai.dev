import Shell from "@/components/layout/Shell";
import ComparisonChart from "@/components/dashboard/ComparisonChart";

export default function Comparison() {
  return (
    <Shell>
      <div className="w-full h-full overflow-auto">
        <ComparisonChart />
      </div>
    </Shell>
  );
}
