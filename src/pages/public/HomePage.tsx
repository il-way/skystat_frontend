import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cloud, Eye, Umbrella, Wind } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";

const FEATURE_CARDS = [
  {
    title: "시정 통계",
    description: "시간별·월별 시정 분포를 빠르게 확인",
    icon: Eye,
  },
  {
    title: "운고 통계",
    description: "운저고도 구간별 발생 빈도와 패턴 분석",
    icon: Cloud,
  },
  {
    title: "바람 통계",
    description: "풍향·풍속 분포와 강풍 구간 영향도 요약",
    icon: Wind,
  },
  {
    title: "현상 통계",
    description: "강수·안개·뇌전 등 현상 발생 경향 정리",
    icon: Umbrella,
  },
];

const MAPPING_CARDS = [
  {
    title: "시정/운고 매핑 리포트",
    description: "월별, 시간대별 시정-운고 분포를 카드형으로 제공합니다.",
    bars: [28, 52, 38, 68, 58, 44],
  },
  {
    title: "풍향/풍속 매핑 리포트",
    description: "풍향 장미도와 풍속 구간 비율을 한 화면에서 비교합니다.",
    bars: [42, 33, 61, 49, 72, 46],
  },
  {
    title: "기상현상 이벤트 매핑",
    description: "강수, 안개, 뇌전 등 주요 현상 빈도와 기간을 요약합니다.",
    bars: [36, 48, 40, 63, 52, 57],
  },
];

const AIRPORT_SHORTCUTS = [
  { label: "ICN", hint: "w/s indicator", desc: "제약사항 & 주요 빈도", icao: "RKSI" },
  { label: "LAX", hint: "w/s indicator", desc: "제약사항 & 주요 빈도", icao: "KLAX" },
  { label: "JFK", hint: "w/s indicator", desc: "제약사항 & 주요 빈도", icao: "KJFK" },
  { label: "HND", hint: "w/s indicator", desc: "제약사항 & 주요 빈도", icao: "RJTT" },
  { label: "DXB", hint: "w/s indicator", desc: "제약사항 & 주요 빈도", icao: "OMDB" },
];

export default function HomePage() {
  useSeo({
    title: "공항별 기상 통계 분석 서비스",
    description:
      "METAR 기반 시정/운고/바람/현상 통계 리포트를 제공하는 공개 랜딩 페이지입니다.",
  });

  const navigate = useNavigate();
  const [icao, setIcao] = useState("RKSI");
  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState("2024-01-01");

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
                  SKY WEATHER ANALYTICS
                </p>
                <h1 className="mt-3 max-w-[560px] text-[36px] font-semibold leading-[1.08] text-white drop-shadow-sm">
                  공항별 기상 통계 분석 서비스
                </h1>
                <p className="mt-4 max-w-[560px] text-[15px] leading-6 text-white/90 drop-shadow-sm">
                  METAR 관측 데이터를 기반으로 시정, 운고, 바람, 기상현상 지표를 공항별로 분석합니다.
                </p>
                <p className="mt-1 max-w-[560px] text-[15px] leading-6 text-white/90 drop-shadow-sm">
                  기간을 지정해 보고서를 열고 운영/기획에 필요한 통계 패턴을 빠르게 확인할 수 있습니다.
                </p>

                <form
                  id="hero-report-form"
                  onSubmit={handleSubmit}
                  className="mt-7 w-full max-w-[860px] rounded-2xl border border-white/30 bg-white/95 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.14)]"
                >
                  <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr] md:items-end">
                    <label className="grid gap-1.5">
                      <span className="text-xs text-slate-600">ICAO</span>
                      <input
                        value={icao}
                        onChange={(event) => setIcao(event.target.value)}
                        placeholder="RKSI, KJFK..."
                        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-xs text-slate-600">From</span>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(event) => setFromDate(event.target.value)}
                        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-xs text-slate-600">To</span>
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
                    리포트 열기
                  </button>
                  <Link
                    to="/guide"
                    className="inline-flex h-10 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    가이드 보기
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
                <h2 className="text-[24px] font-semibold text-slate-900">어떤 분석을 제공하나요?</h2>
                <p className="text-[14px] leading-6 text-slate-600">
                  시정·운고·바람·현상 지표를 기간별로 빠르게 요약합니다.
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {FEATURE_CARDS.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{feature.title}</h3>
                      <p className="mt-2 text-[13px] leading-5 text-slate-600">{feature.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[24px] font-semibold text-slate-900">공항별 METAR 통계 분석 기능 매핑</h2>
                  <p className="mt-2 text-[14px] leading-6 text-slate-600">
                    시정, 운고, 바람, 현상 데이터를 시각화 카드로 구성해 빠르게 비교할 수 있습니다.
                  </p>
                </div>
                <Link
                  to="/report/RKSI?from=2023-01-01&to=2024-01-01"
                  className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  샘플 리포트 보기
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {MAPPING_CARDS.map((item, idx) => (
                  <article
                    key={item.title}
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
                        <div className="mt-2 grid grid-cols-[1fr_2fr] gap-2">
                          <div className="space-y-1">
                            <div className="h-2 w-full rounded bg-slate-200" />
                            <div className="h-2 w-4/5 rounded bg-slate-200" />
                            <div className="h-2 w-3/5 rounded bg-slate-200" />
                          </div>
                          <div className="grid h-[78px] grid-cols-6 items-end gap-1 rounded border border-slate-100 bg-gradient-to-t from-blue-50 to-white p-1.5">
                            {item.bars.map((bar, index) => (
                              <div
                                key={`${idx}-${index}`}
                                className="rounded-sm bg-blue-500/70"
                                style={{ height: `${bar}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-[13px] leading-5 text-slate-600">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mx-auto max-w-2xl space-y-2 text-center">
                <h2 className="text-[24px] font-semibold text-slate-900">추천 공항 리포트</h2>
                <p className="text-[14px] leading-6 text-slate-600">
                  많이 조회되는 공항을 빠르게 열어 비교해보세요.
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
                    <div className="mt-1 text-[13px] text-slate-600">대표 리포트</div>
                    <div className="mt-1 px-3 text-[12px] leading-4 text-slate-400">
                      시정·운고·바람·현상 요약
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
