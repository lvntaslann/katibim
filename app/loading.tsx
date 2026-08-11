import { Logo } from "@/components/layout/Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <Logo size="md" />
      </div>
    </div>
  );
}
