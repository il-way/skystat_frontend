import { useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Cloud, Database, Eye, Snowflake, Wind, Zap } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";

type MetricCard = {
  title: string;
  description: string;
  tip: string;
  example: string;
  icon: LucideIcon;
};

type ThresholdCard = {
  title: string;
  description: string;
  example: string;
  icon: LucideIcon;
  secondaryIcon?: LucideIcon;
};

type MetarReference = {
  code: string;
  meaning: string;
  note: string;
};

const METRIC_CARDS: MetricCard[] = [
  {
    title: "표본수(건)",
    description: "선택 기간 동안 집계에 사용된 METAR 보고서 건수입니다.",
    tip: "해석 팁: 표본수가 적은 구간은 평균 해석에 주의하세요.",
    example: "예: 표본수가 적으면(예: 2,000건) 평균 해석을 보수적으로 보세요.",
    icon: Database,
  },
  {
    title: "평균 시정(km)",
    description: "선택 기간의 평균 시정 수준을 요약합니다(평균은 평시 상태에 가까움).",
    tip: "해석 팁: 리스크 평가는 저시정 임계 초과 일수와 함께 보세요.",
    example: "예: 8.8km면 대체로 양호하나, 저시정(≤800m) 일수도 함께 확인하세요.",
    icon: Eye,
  },
  {
    title: "평균 운고(ft)",
    description: "운고 평균으로, 저운고 빈도는 아래 임계값 지표가 더 직접적입니다.",
    tip: "해석 팁: 평균이 높아도 특정 월의 저운고 집중 여부를 확인하세요.",
    example: "예: 평균이 높아도 특정 월의 저운고(≤300ft) 일수 집중 여부를 확인하세요.",
    icon: Cloud,
  },
  {
    title: "평균 풍속(kt)",
    description: "풍속 평균(kt)으로, 강풍 리스크는 피크/임계 초과 일수로 확인합니다.",
    tip: "해석 팁: 월별 피크풍속 초과 일수와 함께 해석하세요.",
    example: "예: 평균 7kt라도 강풍(피크≥30kt) 일수가 많으면 운항 영향이 커질 수 있습니다.",
    icon: Wind,
  },
];

const THRESHOLD_CARDS: ThresholdCard[] = [
  {
    title: "강풍(피크) ≥ 30kt",
    description: "돌풍/피크 풍속이 기준 이상인 ‘일수’를 월별로 집계합니다.",
    example: "예: 어떤 달에 6일이면, 그 달은 강풍 이벤트가 잦았다는 의미입니다.",
    icon: Wind,
  },
  {
    title: "저시정 ≤ 800m",
    description: "저시정 기준을 만족한 날을 월별로 집계합니다.",
    example: "예: 월별 0~10일처럼 ‘일수’로 집계되어 리스크를 빠르게 비교합니다.",
    icon: Eye,
  },
  {
    title: "저운고 ≤ 300ft",
    description: "저운고 기준을 만족한 날을 월별로 집계합니다.",
    example: "예: 특정 계절에 일수가 늘면 접근/출발 운영 영향이 커질 수 있습니다.",
    icon: Cloud,
  },
  {
    title: "TS / SN",
    description: "METAR 코드(Thunderstorm/Snow)가 포함된 보고서를 월별로 집계합니다.",
    example: "예: TS 2일, SN 0일처럼 코드 포함 빈도를 월별로 확인합니다.",
    icon: Zap,
    secondaryIcon: Snowflake,
  },
];

const REPORT_TIPS = [
  "기간(포함)을 확인하세요",
  "평균 지표로 ‘평시 상태’를 파악하세요",
  "월별 관측 일수로 리스크를 확인하세요",
  "차트로 추세 변화를 확인하세요",
];

const METAR_REFERENCES: MetarReference[] = [
  { code: "TS", meaning: "뇌전(Thunderstorm)", note: "월별 코드 포함 일수로 집계" },
  { code: "SN", meaning: "눈(Snow)", note: "월별 코드 포함 일수로 집계" },
  { code: "RA", meaning: "비(Rain)", note: "강수 상황 파악에 참고" },
  { code: "FG", meaning: "안개(Fog)", note: "저시정과 함께 나타날 수 있음" },
  { code: "SH", meaning: "소나기(Shower)", note: "단시간 변동성 큰 강수 신호" },
  { code: "FZ", meaning: "결빙(Freezing)", note: "결빙 위험 상황 해석에 중요" },
  { code: "BKN", meaning: "조각구름(Broken)", note: "운고/운량 해석 시 참고" },
  { code: "OVC", meaning: "전운(Overcast)", note: "저층운 지속 구간 확인에 유용" },
  { code: "WS", meaning: "윈드시어", note: "바람 리스크 판단 시 별도 확인 필요" },
];

const GUIDE_SECTIONS = [
  { id: "metrics", label: "주요 지표" },
  { id: "thresholds", label: "임계값" },
  { id: "tips", label: "활용 팁" },
] as const;

export default function GuidePage() {
  useSeo({
    title: "가이드",
    description: "공개 리포트에서 사용하는 주요 기상 지표와 임계값 해석 방법을 안내합니다.",
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
                <p className="text-sm font-semibold tracking-wide text-slate-100/90 drop-shadow-sm">GUIDE</p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-white drop-shadow sm:text-5xl">가이드</h1>
                <p className="mt-4 text-sm leading-relaxed text-white/90 drop-shadow-sm sm:text-base">
                  공개 리포트에서 사용하는 주요 기상 지표와 임계값 해석 방법을 안내합니다.
                </p>
                <Link
                  to="/report/RKSI?from=2023-01-01&to=2024-01-01"
                  className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  월별 리포트 열기
                </Link>
                <div className="mt-4 flex flex-wrap gap-2">
                  {GUIDE_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className="rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:bg-white"
                    >
                      {section.label}
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
                  주요 지표 해석하기
                </button>
                <Link
                  to="/report/RKSI?from=2023-01-01&to=2024-01-01"
                  className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  샘플 리포트에서 확인하기
                </Link>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                이 지표는 리포트의 KPI/차트/월별 관측 일수와 연결됩니다.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
                {METRIC_CARDS.map((card) => {
                  const Icon = card.icon;
                  const exampleKey = `metrics-${card.title}`;
                  const isExampleOpen = Boolean(openExamples[exampleKey]);
                  return (
                    <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{card.title}</h3>
                      <p className="mt-2 text-[13px] leading-5 text-slate-600">{card.description}</p>
                      <p className="mt-3 text-sm text-slate-500">{card.tip}</p>
                      <button
                        type="button"
                        onClick={() => toggleExample(exampleKey)}
                        className="mt-3 text-xs font-medium text-blue-600 underline-offset-2 transition hover:text-blue-700 hover:underline"
                      >
                        {isExampleOpen ? "예시 숨기기" : "예시 보기"}
                      </button>
                      {isExampleOpen && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-slate-500">예시:</p>
                          <p className="text-xs leading-5 text-slate-500">{card.example}</p>
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
                임계값 설명하기
              </button>
              <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
                {THRESHOLD_CARDS.map((card) => {
                  const Icon = card.icon;
                  const SecondaryIcon = card.secondaryIcon;
                  const exampleKey = `thresholds-${card.title}`;
                  const isExampleOpen = Boolean(openExamples[exampleKey]);
                  return (
                    <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                        <Icon className="h-5 w-5 text-blue-600" />
                        {SecondaryIcon && <SecondaryIcon className="ml-1 h-4 w-4 text-blue-500" />}
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{card.title}</h3>
                      <p className="mt-2 text-[13px] leading-5 text-slate-600">{card.description}</p>
                      <button
                        type="button"
                        onClick={() => toggleExample(exampleKey)}
                        className="mt-3 text-xs font-medium text-blue-600 underline-offset-2 transition hover:text-blue-700 hover:underline"
                      >
                        {isExampleOpen ? "예시 숨기기" : "예시 보기"}
                      </button>
                      {isExampleOpen && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-slate-500">예시:</p>
                          <p className="text-xs leading-5 text-slate-500">{card.example}</p>
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
              <h2 className="text-xl font-semibold text-slate-900">METAR 코드 빠른 참고</h2>
              <p className="mt-2 text-sm text-slate-600">
                리포트의 TS/SN 등 코드 집계는 METAR 원문에 포함된 코드를 기준으로 합니다.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-slate-600">
                      <th className="px-3 py-2 font-semibold">코드</th>
                      <th className="px-3 py-2 font-semibold">의미</th>
                      <th className="px-3 py-2 font-semibold">비고(리포트 표시)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {METAR_REFERENCES.map((item) => (
                      <tr
                        key={item.code}
                        className="odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100/60"
                      >
                        <td className="px-3 py-2 font-semibold text-slate-800">{item.code}</td>
                        <td className="px-3 py-2 text-slate-700">{item.meaning}</td>
                        <td className="px-3 py-2 text-slate-600">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="tips" className="mt-10 scroll-mt-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <button
                type="button"
                onClick={() => scrollToSection("tips")}
                className="text-left text-xl font-semibold text-slate-900 transition hover:text-slate-700"
              >
                리포트 활용 팁
              </button>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {REPORT_TIPS.map((tip, index) => (
                  <article key={tip} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-sm font-medium text-slate-800">{tip}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-relaxed text-amber-900">
                  본 리포트는 공개 데이터 기반의 요약 정보입니다. 실제 운항 의사결정에는 공식 기상 브리핑/관제
                  지시/운항 규정을 함께 확인하세요.
                </p>
              </div>
              <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">더 궁금한 점이 있나요?</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  자주 묻는 질문(FAQ)에서 데이터/지표/해석 관련 질문을 확인할 수 있습니다.
                </p>
                <Link
                  to="/faq"
                  className="mt-4 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  FAQ로 이동
                </Link>
              </div>
            </div>
          </section>
        </PageContainer>
      </div>
    </div>
  );
}
