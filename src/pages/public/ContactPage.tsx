import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";

export default function ContactPage() {
  useSeo({
    title: "문의하기",
    description: "SkyStat 문의/제휴/정책 관련 연락처",
  });

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">문의하기</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              리포트 해석, 데이터 범위, 정책/광고 관련 문의를 아래 채널로 보내주세요.
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
              to="/terms"
              className="inline-flex h-10 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              이용약관
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

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">문의 채널</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">일반 문의(리포트/데이터/기능)</h3>
            <p className="mt-2 text-sm text-slate-700">
              <a
                className="font-medium text-slate-900 underline underline-offset-2"
                href="mailto:ilway5186@gmail.com"
              >
                ilway5186@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm text-slate-600">권장 포함 정보: ICAO / 기간 / 문의 목적</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">정책/광고/권리 요청</h3>
            <p className="mt-2 text-sm text-slate-700">
              <a
                className="font-medium text-slate-900 underline underline-offset-2"
                href="mailto:ilway5186@gmail.com"
              >
                ilway5186@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              권장 포함 정보: 개인정보/쿠키/광고 관련 요청 목적과 대상 페이지
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">빠른 문의 템플릿</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
          <li>ICAO 코드 (예: RKSI, KJFK)</li>
          <li>조회 기간(From/To) 및 화면의 기간(포함) 표기</li>
          <li>확인하고 싶은 지표(평균 시정, 강풍 일수, TS/SN 등)</li>
          <li>문제 재현 방법(클릭 순서/입력 값)</li>
          <li>스크린샷 또는 오류 메시지(선택)</li>
        </ul>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">이메일 보내기</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          아래 버튼을 누르면 기본 메일 앱에서 바로 문의를 작성할 수 있습니다.
        </p>
        <a
          href="mailto:ilway5186@gmail.com"
          className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          ilway5186@gmail.com으로 메일 보내기
        </a>
      </section>
    </PageContainer>
  );
}
