import { useEffect, useRef, useState } from "react";

export function ChartAutoSizer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr && cr.width > 0 && cr.height > 0) setReady(true);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return <div ref={ref} className="h-full w-full min-w-0">{ready ? children : null}</div>;
}