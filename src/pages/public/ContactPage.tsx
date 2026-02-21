import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import { useSeo } from "../../lib/seo";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation();
  useSeo({
    title: t("contactPage.seo.title"),
    description: t("contactPage.seo.description"),
  });

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t("contactPage.header.title")}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {t("contactPage.header.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/guide"
              className="inline-flex h-10 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("contactPage.header.guideButton")}
            </Link>
            <Link
              to="/terms"
              className="inline-flex h-10 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("contactPage.header.termsButton")}
            </Link>
            <Link
              to="/report/RKSI?from=2023-01-01&to=2024-01-01"
              className="inline-flex h-10 items-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {t("contactPage.header.sampleButton")}
            </Link>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("contactPage.sections.channels.title")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">{t("contactPage.sections.channels.generalTitle")}</h3>
            <p className="mt-2 text-sm text-slate-700">
              <a
                className="font-medium text-slate-900 underline underline-offset-2"
                href="mailto:ilway5186@gmail.com"
              >
                ilway5186@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm text-slate-600">{t("contactPage.sections.channels.generalHint")}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">{t("contactPage.sections.channels.policyTitle")}</h3>
            <p className="mt-2 text-sm text-slate-700">
              <a
                className="font-medium text-slate-900 underline underline-offset-2"
                href="mailto:ilway5186@gmail.com"
              >
                ilway5186@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {t("contactPage.sections.channels.policyHint")}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("contactPage.sections.template.title")}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
          <li>{t("contactPage.sections.template.item1")}</li>
          <li>{t("contactPage.sections.template.item2")}</li>
          <li>{t("contactPage.sections.template.item3")}</li>
          <li>{t("contactPage.sections.template.item4")}</li>
          <li>{t("contactPage.sections.template.item5")}</li>
        </ul>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">{t("contactPage.sections.email.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {t("contactPage.sections.email.description")}
        </p>
        <a
          href="mailto:ilway5186@gmail.com"
          className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {t("contactPage.sections.email.button")}
        </a>
      </section>
    </PageContainer>
  );
}
