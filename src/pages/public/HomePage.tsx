import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cloud, Eye, Umbrella, Wind } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import AdSlot from "../../components/ads/AdSlot";
import { useSeo } from "../../lib/seo";
import { useTranslation } from "react-i18next";

const FEATURE_CARDS = [
  {
    key: "visibility",
    icon: Eye,
  },
  {
    key: "ceiling",
    icon: Cloud,
  },
  {
    key: "wind",
    icon: Wind,
  },
  {
    key: "weather",
    icon: Umbrella,
  },
] as const;

const MAPPING_CARDS = [
  {
    key: "visCeiling",
    preview: "vis-ceiling",
    primaryBars: [24, 36, 40, 58, 66, 54, 42, 30],
    secondaryBars: [18, 22, 30, 45, 52, 47, 35, 24],
  },
  {
    key: "wind",
    preview: "wind",
    primaryBars: [22, 30, 42, 55, 63, 48, 36, 28],
  },
  {
    key: "event",
    preview: "event",
    primaryBars: [12, 24, 18, 34, 26, 38, 22, 30, 16, 28, 20, 26],
  },
] as const;

type MappingCard = (typeof MAPPING_CARDS)[number];
type FeatureCard = (typeof FEATURE_CARDS)[number];

function renderMappingPreview(
  card: MappingCard,
  labels: {
    monthlyHourly: string;
    windRatio: string;
    rainRun: string;
    lowVisibilityCompanion: string;
    eventPeakMonth: string;
  }
) {
  if (card.preview === "vis-ceiling") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-medium text-blue-700">
            VIS
          </span>
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 font-medium text-indigo-700">
            CIG
          </span>
          <span className="ml-auto text-slate-400">{labels.monthlyHourly}</span>
        </div>
        <div className="grid h-[74px] grid-cols-8 items-end gap-1 rounded-md border border-slate-100 bg-white p-1.5">
          {card.primaryBars.map((bar, idx) => (
            <div key={`vis-${idx}`} className="relative h-full">
              <div
                className="absolute inset-x-0 bottom-0 rounded-sm bg-blue-500/70"
                style={{ height: `${bar}%` }}
              />
              {card.secondaryBars ? (
                <div
                  className="absolute inset-x-[2px] bottom-0 rounded-sm bg-indigo-500/60"
                  style={{ height: `${card.secondaryBars[idx]}%` }}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (card.preview === "wind") {
    return (
      <div className="grid grid-cols-[88px_1fr] gap-2">
        <div className="relative mx-auto h-[74px] w-[74px] rounded-full border border-slate-200 bg-gradient-to-b from-blue-50 to-white">
          <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[9px] text-slate-400">N</span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-slate-400">S</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">W</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">E</span>
          <div className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
          {[0, 45, 90, 135].map((deg) => (
            <div
              key={`axis-${deg}`}
              className="absolute left-1/2 top-1/2 h-[30px] w-[1px] -translate-x-1/2 -translate-y-full bg-slate-200"
              style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)` }}
            />
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>{labels.windRatio}</span>
            <span>kt</span>
          </div>
          <div className="grid h-[56px] grid-cols-8 items-end gap-1 rounded-md border border-slate-100 bg-white p-1.5">
            {card.primaryBars.map((bar, idx) => (
              <div
                key={`wind-${idx}`}
                className="rounded-sm bg-blue-500/75"
                style={{ height: `${bar}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
        <span className="rounded-full border border-sky-200 bg-sky-50 px-1.5 py-0.5 font-medium text-sky-700">RA</span>
        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 font-medium text-indigo-700">FG</span>
        <span className="rounded-full border border-purple-200 bg-purple-50 px-1.5 py-0.5 font-medium text-purple-700">TS</span>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-1.5 py-0.5 font-medium text-cyan-700">SN</span>
      </div>
      <div className="grid h-[64px] grid-cols-12 items-end gap-1 rounded-md border border-slate-100 bg-white p-1.5">
        {card.primaryBars.map((bar, idx) => (
          <div
            key={`evt-${idx}`}
            className="rounded-sm bg-gradient-to-t from-blue-500/70 to-blue-300/60"
            style={{ height: `${bar}%` }}
          />
        ))}
      </div>
    </div>
  );
}

const AIRPORT_SHORTCUTS = [
  { label: "ICN", icao: "RKSI" },
  { label: "LAX", icao: "KLAX" },
  { label: "JFK", icao: "KJFK" },
  { label: "HND", icao: "RJTT" },
  { label: "DXB", icao: "OMDB" },
];

export default function HomePage() {
  const { t } = useTranslation();

  useSeo({
    title: t("home.seo.title"),
    description: t("home.seo.description"),
  });

  const navigate = useNavigate();
  const [icao, setIcao] = useState("RKSI");
  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState("2024-01-01");
  const featureCards: Array<FeatureCard & { title: string; description: string; points: string[]; chips: string[] }> =
    FEATURE_CARDS.map((item) => ({
      ...item,
      title: t(`home.featureCards.${item.key}.title`),
      description: t(`home.featureCards.${item.key}.description`),
      points: [
        t(`home.featureCards.${item.key}.point1`),
        t(`home.featureCards.${item.key}.point2`),
      ],
      chips: [
        t(`home.featureCards.${item.key}.chip1`),
        t(`home.featureCards.${item.key}.chip2`),
        t(`home.featureCards.${item.key}.chip3`),
      ],
    }));
  const mappingPreviewLabels = {
    monthlyHourly: t("home.preview.monthlyHourly"),
    windRatio: t("home.preview.windRatio"),
    rainRun: t("home.preview.rainRun"),
    lowVisibilityCompanion: t("home.preview.lowVisibilityCompanion"),
    eventPeakMonth: t("home.preview.eventPeakMonth"),
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = icao.trim().toUpperCase();
    if (!normalized) return;

    const query = new URLSearchParams();
    if (fromDate) query.set("from", fromDate);
    if (toDate) query.set("to", toDate);

    const queryString = query.toString();
    navigate(`/report/${normalized}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="w-full bg-slate-50 pb-14">
      <section className="relative">
        <PageContainer>
          <div className="relative min-h-[420px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-[position:70%_55%]"
              style={{
                backgroundImage: "url('/home-hero.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative z-10 flex min-h-[420px] items-center px-5 py-10 sm:px-8">
              <div className="w-full max-w-4xl text-white">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-100/90 drop-shadow-sm">
                  {t("home.hero.eyebrow")}
                </p>
                <h1 className="mt-3 max-w-[560px] text-[36px] font-semibold leading-[1.08] text-white drop-shadow-sm">
                  {t("home.hero.title")}
                </h1>
                <p className="mt-4 max-w-[560px] text-[15px] leading-6 text-white/90 drop-shadow-sm">
                  {t("home.hero.body1")}
                </p>
                <p className="mt-1 max-w-[560px] text-[15px] leading-6 text-white/90 drop-shadow-sm">
                  {t("home.hero.body2")}
                </p>

                <form
                  id="hero-report-form"
                  onSubmit={handleSubmit}
                  className="mt-7 w-full max-w-[860px] rounded-2xl border border-white/30 bg-white/95 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.14)]"
                >
                  <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr] md:items-end">
                    <label className="grid gap-1.5">
                      <span className="text-xs text-slate-600">{t("labels.icao")}</span>
                      <input
                        value={icao}
                        onChange={(event) => setIcao(event.target.value)}
                        placeholder="RKSI, KJFK..."
                        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-xs text-slate-600">{t("labels.from")}</span>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(event) => setFromDate(event.target.value)}
                        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-xs text-slate-600">{t("labels.to")}</span>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(event) => setToDate(event.target.value)}
                        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                      />
                    </label>
                  </div>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="submit"
                    form="hero-report-form"
                    className="inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {t("actions.openReport")}
                  </button>
                  <Link
                    to="/guide"
                    className="inline-flex h-10 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {t("actions.viewGuide")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <div className="mt-10 space-y-10 sm:mt-12">
        <PageContainer>
          <section>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mx-auto max-w-2xl space-y-2 text-center">
                <h2 className="text-[24px] font-semibold text-slate-900">{t("home.sections.featuresTitle")}</h2>
                <p className="text-[14px] leading-6 text-slate-600">
                  {t("home.sections.featuresDescription")}
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {featureCards.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-2">
                        <h3 className="text-[15px] font-semibold text-slate-900">{feature.title}</h3>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {t("home.sections.coreBadge")}
                        </span>
                      </div>
                      <p className="mt-2 text-[13px] leading-5 text-slate-600">{feature.description}</p>
                      <ul className="mt-3 space-y-1.5 text-[12px] leading-5 text-slate-500">
                        {feature.points.map((point) => (
                          <li key={point} className="flex items-start gap-1.5">
                            <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {feature.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <AdSlot slotKey="home_main" className="mt-10" minHeight={280} />

          <section className="mt-10">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[24px] font-semibold text-slate-900">{t("home.sections.mappingTitle")}</h2>
                  <p className="mt-2 text-[14px] leading-6 text-slate-600">
                    {t("home.sections.mappingDescription")}
                  </p>
                </div>
                <Link
                  to="/report/RKSI?from=2023-01-01&to=2024-01-01"
                  className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  {t("actions.viewSampleReport")}
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {MAPPING_CARDS.map((item) => (
                  <article
                    key={item.key}
                    className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-3">
                      <div className="h-[120px] rounded-lg border border-slate-200 bg-white/80 p-2">
                        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          <div className="ml-2 h-1.5 w-20 rounded bg-slate-200" />
                        </div>
                        <div className="mt-2">{renderMappingPreview(item, mappingPreviewLabels)}</div>
                      </div>
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-slate-900">
                      {t(`home.mappingCards.${item.key}.title`)}
                    </h3>
                    <p className="mt-2 text-[13px] leading-5 text-slate-600">
                      {t(`home.mappingCards.${item.key}.description`)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mx-auto max-w-2xl space-y-2 text-center">
                <h2 className="text-[24px] font-semibold text-slate-900">{t("home.sections.recommendTitle")}</h2>
                <p className="text-[14px] leading-6 text-slate-600">
                  {t("home.sections.recommendDescription")}
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {AIRPORT_SHORTCUTS.map((airport) => (
                  <Link
                    key={airport.label}
                    to={`/report/${airport.icao}?from=2023-01-01&to=2024-01-01`}
                    className="group flex h-[96px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/60 text-center transition hover:bg-slate-50"
                  >
                    <div className="text-[20px] font-semibold tracking-tight text-slate-900">{airport.label}</div>
                    <div className="mt-1 text-[13px] text-slate-600">{t("home.sections.airportReportLabel")}</div>
                    <div className="mt-1 px-3 text-[12px] leading-4 text-slate-400">
                      {t("home.sections.airportSummary")}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </PageContainer>
      </div>
    </div>
  );
}
