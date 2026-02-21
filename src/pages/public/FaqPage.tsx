import { Minus, Plus, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import AdSlot from "../../components/ads/AdSlot";
import { useSeo } from "../../lib/seo";
import { useTranslation } from "react-i18next";

type FaqCategory = "access" | "data" | "metric" | "tech";

type FaqItem = {
  id: string;
  category: FaqCategory;
};

const CATEGORY_FILTERS: Array<"all" | FaqCategory> = ["all", "access", "data", "metric", "tech"];
const RECOMMENDED_TERMS = ["toExclusive", "periodInclusive", "coverage", "tsSn", "vis800", "wind30"] as const;

const FAQ_ITEMS: FaqItem[] = [
  { id: "access-public-report", category: "access" },
  { id: "access-csv-download", category: "access" },
  { id: "data-coverage-meaning", category: "data" },
  { id: "data-inclusive-to-exclusive", category: "data" },
  { id: "data-global-range", category: "data" },
  { id: "metric-average-vs-days", category: "metric" },
  { id: "metric-visibility-threshold", category: "metric" },
  { id: "metric-ts-sn-meaning", category: "metric" },
  { id: "tech-spa-fallback", category: "tech" },
  { id: "tech-zero-or-dash", category: "tech" },
];

export default function FaqPage() {
  const { t } = useTranslation();
  useSeo({
    title: t("faqPage.seo.title"),
    description: t("faqPage.seo.description"),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORY_FILTERS)[number]>("all");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === "all" ? true : item.category === selectedCategory;
      if (!matchCategory) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      const haystack = `${t(`faqPage.categories.${item.category}`)} ${t(`faqPage.items.${item.id}.q`)} ${t(`faqPage.items.${item.id}.a`)}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch, selectedCategory, t]);

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t("faqPage.header.title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {t("faqPage.header.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/guide"
              className="inline-flex h-10 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("faqPage.header.guideButton")}
            </Link>
            <Link
              to="/report/RKSI?from=2023-01-01&to=2024-01-01"
              className="inline-flex h-10 items-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {t("faqPage.header.sampleButton")}
            </Link>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("faqPage.filters.searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="mt-3">
          <p className="text-xs text-slate-500">{t("faqPage.filters.recommendedLabel")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {RECOMMENDED_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchTerm(t(`faqPage.recommendedTerms.${term}`));
                  searchInputRef.current?.focus();
                }}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                {t(`faqPage.recommendedTerms.${term}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {category === "all" ? t("faqPage.categories.all") : t(`faqPage.categories.${category}`)}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-sm text-slate-500">{t("faqPage.filters.count", { count: filteredItems.length })}</p>
      </section>

      <section className="space-y-4">
        {!filteredItems.length && (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">{t("faqPage.filters.empty")}</p>
          </article>
        )}

        {filteredItems.map((item) => {
          const isOpen = Boolean(openMap[item.id]);
          return (
            <details
              key={item.id}
              onToggle={(event) => {
                const { open } = event.currentTarget;
                setOpenMap((previous) => ({ ...previous, [item.id]: open }));
              }}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                isOpen ? "border-slate-300 bg-slate-50/50" : "border-slate-200"
              }`}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <div>
                  <p className="text-xs font-medium text-slate-500">{t(`faqPage.categories.${item.category}`)}</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{t(`faqPage.items.${item.id}.q`)}</p>
                </div>
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{t(`faqPage.items.${item.id}.a`)}</p>
            </details>
          );
        })}
      </section>

      <AdSlot slotKey="faq_main" minHeight={280} />
    </PageContainer>
  );
}
