import { useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Cloud, Database, Eye, Snowflake, Wind, Zap } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import AdSlot from "../../components/ads/AdSlot";
import { useSeo } from "../../lib/seo";
import { useTranslation } from "react-i18next";

type MetricCardKey = {
  key: "sampleSize" | "avgVisibility" | "avgCeiling" | "avgWind";
  icon: LucideIcon;
};

type ThresholdCardKey = {
  key: "strongWind" | "lowVisibility" | "lowCeiling" | "tsSn";
  icon: LucideIcon;
  secondaryIcon?: LucideIcon;
};

const METRIC_CARDS: MetricCardKey[] = [
  { key: "sampleSize", icon: Database },
  { key: "avgVisibility", icon: Eye },
  { key: "avgCeiling", icon: Cloud },
  { key: "avgWind", icon: Wind },
];

const THRESHOLD_CARDS: ThresholdCardKey[] = [
  { key: "strongWind", icon: Wind },
  { key: "lowVisibility", icon: Eye },
  { key: "lowCeiling", icon: Cloud },
  { key: "tsSn", icon: Zap, secondaryIcon: Snowflake },
];

const REPORT_TIP_KEYS = ["tip1", "tip2", "tip3", "tip4"] as const;
const METAR_CODES = ["TS", "SN", "RA", "FG", "SH", "FZ", "BKN", "OVC", "WS"] as const;

const GUIDE_SECTIONS = [
  { id: "metrics", labelKey: "metrics" },
  { id: "thresholds", labelKey: "thresholds" },
  { id: "tips", labelKey: "tips" },
] as const;

export default function GuidePage() {
  const { t } = useTranslation();
  useSeo({
    title: t("guidePage.seo.title"),
    description: t("guidePage.seo.description"),
  });
  const [openExamples, setOpenExamples] = useState<Record<string, boolean>>({});

  const scrollToSection = (sectionId: (typeof GUIDE_SECTIONS)[number]["id"]) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleExample = (exampleKey: string) => {
    setOpenExamples((previous) => ({
      ...previous,
      [exampleKey]: !previous[exampleKey],
    }));
  };

  return (
    <div className="w-full bg-slate-50 pb-14">
      <section className="relative">
        <PageContainer>
          <div className="relative min-h-[420px] overflow-hidden sm:min-h-[420px]">
            <div
              className="absolute inset-0 bg-cover bg-[position:70%_120%]"
              style={{
                backgroundImage: "url('/guide-hero.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative z-10 flex min-h-[420px] items-center px-8 sm:min-h-[420px] sm:px-10">
              <div className="max-w-2xl text-white">
                <p className="text-sm font-semibold tracking-wide text-slate-100/90 drop-shadow-sm">{t("guidePage.hero.eyebrow")}</p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-white drop-shadow sm:text-5xl">{t("guidePage.hero.title")}</h1>
                <p className="mt-4 text-sm leading-relaxed text-white/90 drop-shadow-sm sm:text-base">
                  {t("guidePage.hero.description")}
                </p>
                <Link
                  to="/report/RKSI?from=2023-01-01&to=2024-01-01"
                  className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {t("guidePage.hero.primaryCta")}
                </Link>
                <div className="mt-4 flex flex-wrap gap-2">
                  {GUIDE_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className="rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:bg-white"
                    >
                      {t(`guidePage.sectionShortcuts.${section.labelKey}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <div className="mt-10 space-y-10 sm:mt-12">
        <PageContainer>
          <section id="metrics" className="scroll-mt-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("metrics")}
                  className="text-left text-xl font-semibold text-slate-900 transition hover:text-slate-700"
                >
                  {t("guidePage.metrics.title")}
                </button>
                <Link
                  to="/report/RKSI?from=2023-01-01&to=2024-01-01"
                  className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  {t("guidePage.metrics.sampleLink")}
                </Link>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {t("guidePage.metrics.subtitle")}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
                {METRIC_CARDS.map((card) => {
                  const Icon = card.icon;
                  const exampleKey = `metrics-${card.key}`;
                  const isExampleOpen = Boolean(openExamples[exampleKey]);
                  return (
                    <article key={card.key} className="rounded-2xl border border-slate-200 bg-white p-6">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{t(`guidePage.metrics.cards.${card.key}.title`)}</h3>
                      <p className="mt-2 text-[13px] leading-5 text-slate-600">{t(`guidePage.metrics.cards.${card.key}.description`)}</p>
                      <p className="mt-3 text-sm text-slate-500">{t(`guidePage.metrics.cards.${card.key}.tip`)}</p>
                      <button
                        type="button"
                        onClick={() => toggleExample(exampleKey)}
                        className="mt-3 text-xs font-medium text-blue-600 underline-offset-2 transition hover:text-blue-700 hover:underline"
                      >
                        {isExampleOpen ? t("guidePage.examples.hide") : t("guidePage.examples.show")}
                      </button>
                      {isExampleOpen && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-slate-500">{t("guidePage.examples.label")}</p>
                          <p className="text-xs leading-5 text-slate-500">{t(`guidePage.metrics.cards.${card.key}.example`)}</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="thresholds" className="mt-10 scroll-mt-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <button
                type="button"
                onClick={() => scrollToSection("thresholds")}
                className="text-left text-xl font-semibold text-slate-900 transition hover:text-slate-700"
              >
                {t("guidePage.thresholds.title")}
              </button>
              <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
                {THRESHOLD_CARDS.map((card) => {
                  const Icon = card.icon;
                  const SecondaryIcon = card.secondaryIcon;
                  const exampleKey = `thresholds-${card.key}`;
                  const isExampleOpen = Boolean(openExamples[exampleKey]);
                  return (
                    <article key={card.key} className="rounded-2xl border border-slate-200 bg-white p-6">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                        <Icon className="h-5 w-5 text-blue-600" />
                        {SecondaryIcon && <SecondaryIcon className="ml-1 h-4 w-4 text-blue-500" />}
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{t(`guidePage.thresholds.cards.${card.key}.title`)}</h3>
                      <p className="mt-2 text-[13px] leading-5 text-slate-600">{t(`guidePage.thresholds.cards.${card.key}.description`)}</p>
                      <button
                        type="button"
                        onClick={() => toggleExample(exampleKey)}
                        className="mt-3 text-xs font-medium text-blue-600 underline-offset-2 transition hover:text-blue-700 hover:underline"
                      >
                        {isExampleOpen ? t("guidePage.examples.hide") : t("guidePage.examples.show")}
                      </button>
                      {isExampleOpen && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-slate-500">{t("guidePage.examples.label")}</p>
                          <p className="text-xs leading-5 text-slate-500">{t(`guidePage.thresholds.cards.${card.key}.example`)}</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-semibold text-slate-900">{t("guidePage.metar.title")}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {t("guidePage.metar.description")}
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-slate-600">
                      <th className="px-3 py-2 font-semibold">{t("guidePage.metar.headers.code")}</th>
                      <th className="px-3 py-2 font-semibold">{t("guidePage.metar.headers.meaning")}</th>
                      <th className="px-3 py-2 font-semibold">{t("guidePage.metar.headers.note")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {METAR_CODES.map((code) => (
                      <tr
                        key={code}
                        className="odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100/60"
                      >
                        <td className="px-3 py-2 font-semibold text-slate-800">{code}</td>
                        <td className="px-3 py-2 text-slate-700">{t(`guidePage.metar.rows.${code}.meaning`)}</td>
                        <td className="px-3 py-2 text-slate-600">{t(`guidePage.metar.rows.${code}.note`)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <AdSlot slotKey="guide_main" className="mt-10" minHeight={280} />

          <section id="tips" className="mt-10 scroll-mt-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <button
                type="button"
                onClick={() => scrollToSection("tips")}
                className="text-left text-xl font-semibold text-slate-900 transition hover:text-slate-700"
              >
                {t("guidePage.tips.title")}
              </button>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {REPORT_TIP_KEYS.map((tipKey, index) => (
                  <article key={tipKey} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-sm font-medium text-slate-800">{t(`guidePage.tips.items.${tipKey}`)}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-relaxed text-amber-900">
                  {t("guidePage.tips.warning")}
                </p>
              </div>
              <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">{t("guidePage.tips.faqCtaTitle")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t("guidePage.tips.faqCtaDescription")}
                </p>
                <Link
                  to="/faq"
                  className="mt-4 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {t("guidePage.tips.faqCtaButton")}
                </Link>
              </div>
            </div>
          </section>
        </PageContainer>
      </div>
    </div>
  );
}
