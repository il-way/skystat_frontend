import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();
  useSeo({
    title: t("aboutPage.seo.title"),
    description: t("aboutPage.seo.description"),
  });

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t("aboutPage.header.title")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {t("aboutPage.header.description")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/guide"
            className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {t("aboutPage.header.guideButton")}
          </Link>
          <Link
            to="/report/RKSI?from=2023-01-01&to=2024-01-01"
            className="inline-flex rounded-full bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {t("aboutPage.header.sampleButton")}
          </Link>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("aboutPage.sections.overview.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("aboutPage.sections.overview.body")}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("aboutPage.sections.range.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("aboutPage.sections.range.prefix")}{" "}
          <span className="font-medium text-slate-900">2010-01-01 ~ 2025-12-31</span>{" "}
          {t("aboutPage.sections.range.suffix")}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("aboutPage.sections.report.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("aboutPage.sections.report.body")}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("aboutPage.sections.disclaimer.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("aboutPage.sections.disclaimer.body")}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("aboutPage.sections.contact.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          <a className="font-medium text-slate-900 underline underline-offset-2" href="mailto:ilway5186@gmail.com">
            ilway5186@gmail.com
          </a>
        </p>
      </section>
    </PageContainer>
  );
}
