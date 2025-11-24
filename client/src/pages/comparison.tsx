import Shell from "@/components/layout/Shell";
import PerformanceLeaderboard from "@/components/dashboard/PerformanceLeaderboard";

export default function Comparison() {
  return (
    <Shell>
      <div className="w-full h-full overflow-auto">
        <PerformanceLeaderboard />
      </div>
    </Shell>
  );
}
