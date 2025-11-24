import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type LoadingWrapperProps = {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
};

export function LoadingWrapper({
  loading,
  children,
  className,
}: LoadingWrapperProps) {
  return (
    <div className={cn("relative", className)}>
      {children}

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] transition-all duration-200">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
