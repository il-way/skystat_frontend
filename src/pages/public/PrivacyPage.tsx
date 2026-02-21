import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";
import { useTranslation } from "react-i18next";

const LAST_UPDATED = "2026-02-20";

export default function PrivacyPage() {
  const { t } = useTranslation();
  useSeo({
    title: t("privacyPage.seo.title"),
    description: t("privacyPage.seo.description"),
  });

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t("privacyPage.header.title")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {t("privacyPage.header.description")}
        </p>
        <p className="mt-2 text-sm text-slate-500">{t("privacyPage.header.lastUpdated", { date: LAST_UPDATED })}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/guide"
            className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {t("privacyPage.header.guideButton")}
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
            {t("privacyPage.header.termsButton")}
          </Link>
          <Link
            to="/report/RKSI?from=2023-01-01&to=2024-01-01"
            className="inline-flex rounded-full bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {t("privacyPage.header.sampleButton")}
          </Link>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("privacyPage.sections.overview.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("privacyPage.sections.overview.body")}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("privacyPage.sections.collect.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("privacyPage.sections.collect.body")}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("privacyPage.sections.purpose.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("privacyPage.sections.purpose.body")}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("privacyPage.sections.cookie.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("privacyPage.sections.cookie.body1")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("privacyPage.sections.cookie.body2")}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("privacyPage.sections.retention.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("privacyPage.sections.retention.body")}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("privacyPage.sections.contact.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {t("privacyPage.sections.contact.prefix")}{" "}
          <a className="font-medium text-slate-900 underline underline-offset-2" href="mailto:ilway5186@gmail.com">
            ilway5186@gmail.com
          </a>
        </p>
        <Link
          to="/contact"
          className="mt-3 inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {t("privacyPage.sections.contact.button")}
        </Link>
      </section>
    </PageContainer>
  );
}
