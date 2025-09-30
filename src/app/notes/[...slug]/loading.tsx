import { FuturisticCard } from "@/components/FuturisticCard";

export default function Loading() {
  return (
    <div className="h-full">
      <FuturisticCard
        title="Loading..."
        className="h-full"
      >
        <div className="markdown">
          <p className="text-foreground/60">Loading note content...</p>
        </div>
      </FuturisticCard>
    </div>
  );
}