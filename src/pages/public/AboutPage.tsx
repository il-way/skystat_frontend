import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";

export default function AboutPage() {
  useSeo({
    title: "About",
    description: "SkyStat 서비스 소개 및 데이터 범위 안내",
  });

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">About SkyStat</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          SkyStat 서비스 소개와 공개 통계 데이터 범위를 간단히 안내합니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/guide"
            className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            가이드 보기
          </Link>
          <Link
            to="/report/RKSI?from=2023-01-01&to=2024-01-01"
            className="inline-flex rounded-full bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            샘플 리포트
          </Link>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">SkyStat 소개</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          SkyStat는 공항별 METAR 데이터를 기반으로 시정·운고·바람·기상현상 통계를 공개 리포트 형태로
          제공하는 서비스입니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">데이터 범위</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          공개 통계 기준 데이터 범위는 <span className="font-medium text-slate-900">2010-01-01 ~ 2025-12-31</span>{" "}
          입니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">리포트 구성</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          리포트는 KPI 요약 카드, 연월 평균 추세 차트, 임계값 기반 월별 관측 일수 테이블로 구성됩니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">면책</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          본 서비스의 공개 통계는 참고용 요약 정보이며, 공식 브리핑·관제 지시·운항 규정을 대체할 수
          없습니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">문의</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          <a className="font-medium text-slate-900 underline underline-offset-2" href="mailto:ilway5186@gmail.com">
            ilway5186@gmail.com
          </a>
        </p>
      </section>
    </PageContainer>
  );
}
