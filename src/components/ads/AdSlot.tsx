import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

type AdSlotKey =
  | "home_main"
  | "guide_main"
  | "faq_main"
  | "report_main"
  | "dashboard_main"
  | "visibility_bottom"
  | "wind_bottom"
  | "altimeter_bottom"
  | "weather_bottom"
  | "temperature_bottom"
  | "windrose_bottom";

type AdSlotProps = {
  slotKey: AdSlotKey;
  className?: string;
  minHeight?: number;
};

const ENV = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

const SLOT_ENV_BY_KEY: Record<AdSlotKey, string | undefined> = {
  home_main: ENV.VITE_ADSENSE_SLOT_HOME_MAIN,
  guide_main: ENV.VITE_ADSENSE_SLOT_GUIDE_MAIN,
  faq_main: ENV.VITE_ADSENSE_SLOT_FAQ_MAIN,
  report_main: ENV.VITE_ADSENSE_SLOT_REPORT_MAIN,
  dashboard_main: ENV.VITE_ADSENSE_SLOT_DASHBOARD_MAIN,
  visibility_bottom: ENV.VITE_ADSENSE_SLOT_VISIBILITY_BOTTOM,
  wind_bottom: ENV.VITE_ADSENSE_SLOT_WIND_BOTTOM,
  altimeter_bottom: ENV.VITE_ADSENSE_SLOT_ALTIMETER_BOTTOM,
  weather_bottom: ENV.VITE_ADSENSE_SLOT_WEATHER_BOTTOM,
  temperature_bottom: ENV.VITE_ADSENSE_SLOT_TEMPERATURE_BOTTOM,
  windrose_bottom: ENV.VITE_ADSENSE_SLOT_WINDROSE_BOTTOM,
};

function normalizeAdClient(raw: string) {
  const value = raw.trim();
  if (!value) {
    return "";
  }
  if (/^ca-pub-\d+$/.test(value)) {
    return value;
  }
  if (/^pub-\d+$/.test(value)) {
    return `ca-${value}`;
  }
  return "";
}

export default function AdSlot({ slotKey, className, minHeight = 280 }: AdSlotProps) {
  const adPushedRef = useRef(false);
  const slotRef = useRef<HTMLModElement | null>(null);

  const enabled = ENV.VITE_ADSENSE_ENABLE_SLOTS === "true";
  const adClient = useMemo(
    () => normalizeAdClient(ENV.VITE_ADSENSE_PUBLISHER_ID ?? ""),
    []
  );
  const adSlot = (SLOT_ENV_BY_KEY[slotKey] ?? "").trim();

  const canRender = enabled && /^ca-pub-\d+$/.test(adClient) && /^\d+$/.test(adSlot);

  useEffect(() => {
    if (!canRender || adPushedRef.current || !slotRef.current) {
      return;
    }

    try {
      const adsbygoogle = (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle ?? [];
      (window as typeof window & { adsbygoogle: unknown[] }).adsbygoogle = adsbygoogle;
      adsbygoogle.push({});
      adPushedRef.current = true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("[AdSlot] adsbygoogle push failed:", error);
      }
    }
  }, [canRender]);

  if (!canRender) {
    return null;
  }

  return (
    <section
      aria-label="advertisement"
      className={cn("notranslate w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-2 shadow-sm", className)}
      translate="no"
    >
      <ins
        ref={slotRef}
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: `${minHeight}px` }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}
