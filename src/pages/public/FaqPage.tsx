import { Minus, Plus, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";

type FaqCategory = "접근/권한" | "데이터/범위" | "지표/해석" | "기술/페이지";

type FaqItem = {
  id: string;
  category: FaqCategory;
  q: string;
  a: string;
};

const CATEGORY_FILTERS = ["전체", "접근/권한", "데이터/범위", "지표/해석", "기술/페이지"] as const;
const RECOMMENDED_TERMS = [
  "to 미포함",
  "기간(포함)",
  "커버리지",
  "TS/SN",
  "저시정 800m",
  "강풍 30kt",
] as const;

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "access-public-report",
    category: "접근/권한",
    q: "공개 리포트는 로그인 없이 볼 수 있나요?",
    a: "/report/:icao 같은 공개 페이지는 로그인 없이 열람 가능합니다.",
  },
  {
    id: "access-csv-download",
    category: "접근/권한",
    q: "CSV 다운로드는 가능한가요?",
    a: "현재는 제공 계획이며, 향후 유료 기능으로 제공될 수 있습니다.",
  },
  {
    id: "data-coverage-meaning",
    category: "데이터/범위",
    q: "데이터 커버리지는 무엇인가요?",
    a: "선택 기간 내 실제로 관측/저장된 구간(결측 제외)을 의미합니다.",
  },
  {
    id: "data-inclusive-to-exclusive",
    category: "데이터/범위",
    q: "기간(포함)과 To(미포함)가 헷갈려요.",
    a: "화면의 ‘기간(포함)’은 실제 포함 범위이며, 내부 조회는 [from, to)로 To는 포함되지 않습니다.",
  },
  {
    id: "data-global-range",
    category: "데이터/범위",
    q: "모든 공항 데이터 범위는 어디까지인가요?",
    a: "현재 공개 데이터는 2010-01-01 ~ 2025-12-31 범위 내에서 제공됩니다.",
  },
  {
    id: "metric-average-vs-days",
    category: "지표/해석",
    q: "월별 평균(차트)과 월별 관측 일수(테이블)의 차이는?",
    a: "평균은 ‘평시 상태’ 요약, 관측 일수는 임계값 초과 ‘리스크 빈도’ 비교에 적합합니다.",
  },
  {
    id: "metric-visibility-threshold",
    category: "지표/해석",
    q: "저시정 ≤ 800m는 어떤 의미인가요?",
    a: "해당 기준을 만족한 날의 개수를 월별로 집계합니다.",
  },
  {
    id: "metric-ts-sn-meaning",
    category: "지표/해석",
    q: "TS/SN은 무엇을 의미하나요?",
    a: "METAR 코드로 뇌전(TS)·눈(SN) 등이 포함된 보고서의 빈도를 월별로 집계합니다.",
  },
  {
    id: "tech-spa-fallback",
    category: "기술/페이지",
    q: "링크로 바로 들어가면(직접 URL) 페이지가 안 열릴 때가 있어요.",
    a: "SPA 특성상 서버가 index.html fallback을 반환하도록 설정돼야 합니다.",
  },
  {
    id: "tech-zero-or-dash",
    category: "기술/페이지",
    q: "값이 0 또는 ‘-’로 보이는 이유는?",
    a: "해당 기간 데이터가 없거나, 조건에 해당하는 이벤트가 없을 수 있습니다.",
  },
];

export default function FaqPage() {
  useSeo({
    title: "자주 묻는 질문(FAQ)",
    description: "공개 리포트/지표/데이터 범위/기술 동작에 대한 자주 묻는 질문을 확인하세요.",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORY_FILTERS)[number]>("전체");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCategory =
        selectedCategory === "전체" ? true : item.category === selectedCategory;
      if (!matchCategory) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      const haystack = `${item.q} ${item.a} ${item.category}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch, selectedCategory]);

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              자주 묻는 질문(FAQ)
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              공개 리포트/지표/데이터 범위/기술 동작에 대해 자주 묻는 질문을 정리했습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/guide"
              className="inline-flex h-10 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              가이드 보기
            </Link>
            <Link
              to="/report/RKSI?from=2023-01-01&to=2024-01-01"
              className="inline-flex h-10 items-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              샘플 리포트 보기
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
            placeholder="검색: 기간, 커버리지, 임계값, TS/SN ..."
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="mt-3">
          <p className="text-xs text-slate-500">추천 검색어:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {RECOMMENDED_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchTerm(term);
                  searchInputRef.current?.focus();
                }}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                {term}
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
                {category}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-sm text-slate-500">표시: {filteredItems.length}개</p>
      </section>

      <section className="space-y-4">
        {!filteredItems.length && (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">검색 결과가 없습니다.</p>
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
                  <p className="text-xs font-medium text-slate-500">{item.category}</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{item.q}</p>
                </div>
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{item.a}</p>
            </details>
          );
        })}
      </section>
    </PageContainer>
  );
}
