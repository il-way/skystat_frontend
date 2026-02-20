import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";

export default function TermsPage() {
  useSeo({
    title: "이용약관",
    description: "SkyStat 공개 페이지 이용약관",
  });

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">이용약관</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          SkyStat 공개 리포트와 가이드 이용 시 적용되는 기본 원칙을 안내합니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/guide"
            className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            가이드
          </Link>
          <Link
            to="/faq"
            className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            FAQ
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
        <h2 className="text-lg font-semibold text-slate-900">서비스 소개 및 목적</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          SkyStat는 공개 리포트/가이드를 통해 METAR 기반 통계 요약 정보를 제공합니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">데이터 및 면책</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          본 서비스의 정보는 참고용 요약이며, 공식 기상 브리핑·관제 지시·운항 규정을 대체하지 않습니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">이용자의 책임 및 금지 행위</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          이용자는 서비스 오남용, 과도한 자동 요청, 비정상 접근, 보안 침해 시도를 해서는 안 됩니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">책임 제한</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          공개 리포트는 집계/요약 데이터의 특성상 한계가 있으며, 이를 근거로 한 의사결정의 결과에 대해
          서비스 제공자는 법령이 허용하는 범위 내에서 책임이 제한됩니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">약관 변경</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          서비스 정책 또는 운영 방식 변경에 따라 약관은 업데이트될 수 있으며, 변경 내용은 공개 페이지를
          통해 공지됩니다.
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
