import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";

const LAST_UPDATED = "2026-02-20";

export default function PrivacyPage() {
  useSeo({
    title: "개인정보처리방침",
    description: "SkyStat 공개 페이지의 개인정보 및 쿠키/광고 처리 방침 안내",
  });

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">개인정보처리방침</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          SkyStat 공개 페이지의 개인정보 및 쿠키/광고 처리 방침을 안내합니다.
        </p>
        <p className="mt-2 text-sm text-slate-500">최종 업데이트: {LAST_UPDATED}</p>
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
            to="/terms"
            className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            이용약관
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
        <h2 className="text-lg font-semibold text-slate-900">개요</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          SkyStat 공개 리포트/가이드는 METAR 기반 통계 요약을 제공합니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">수집하는 정보</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          서비스 운영 과정에서 IP 주소, 브라우저/기기 정보, 접속 시간, 요청 로그, 오류 로그 등 기술적
          정보를 처리할 수 있습니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">이용 목적</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          수집된 정보는 서비스 안정성 확보, 보안 대응, 품질 개선, 오류 분석, 부정 사용 방지 목적으로
          활용됩니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">쿠키 및 광고 안내</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          제3자 광고 사업자(예: Google 등)는 쿠키를 사용하여 관심 기반 광고를 제공할 수 있습니다.
          사용자는 브라우저 설정 또는 광고 설정을 통해 쿠키 및 맞춤형 광고를 제한할 수 있습니다.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          광고 도입 전/후와 관계없이 본 고지 정책은 동일하게 유지됩니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">보관 기간</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          로그 및 기술 정보는 서비스 운영과 보안 점검에 필요한 최소 기간 동안만 보관하며, 목적 달성 후
          합리적인 절차에 따라 삭제합니다.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">문의</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          문의:{" "}
          <a className="font-medium text-slate-900 underline underline-offset-2" href="mailto:ilway5186@gmail.com">
            ilway5186@gmail.com
          </a>
        </p>
        <Link
          to="/contact"
          className="mt-3 inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          문의 페이지로 이동
        </Link>
      </section>
    </PageContainer>
  );
}
