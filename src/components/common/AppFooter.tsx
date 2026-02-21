import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <div className="flex flex-col gap-3 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>SkyStat aviation weather statistics</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/about"
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("footer.about")}
            </Link>
            <Link
              to="/privacy"
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("footer.contact")}
            </Link>
            <Link
              to="/terms"
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("footer.terms")}
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} SkyStat</p>
        </div>
      </div>
    </footer>
  );
}
