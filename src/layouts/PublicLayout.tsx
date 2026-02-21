import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { PanelLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const NAV_ITEMS = [
  { to: "/about", key: "about" },
  { to: "/guide", key: "guide" },
  { to: "/faq", key: "faq" },
  { to: "/terms", key: "terms" },
  { to: "/privacy", key: "privacy" },
  { to: "/contact", key: "contact" },
];

export default function PublicLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={t("aria.openMenu")}
                aria-expanded={isMobileNavOpen}
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
                className="inline-flex size-7 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100 lg:hidden"
              >
                <PanelLeftIcon className="size-4" />
              </button>
              <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
                SkyStat
              </Link>
            </div>

            <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "text-slate-900 underline underline-offset-4" : "hover:text-slate-900"
                  }
                >
                  {t(`nav.${item.key}`)}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                to="/dashboard"
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {t("actions.analyze")}
              </Link>
            </div>
          </div>
          {isMobileNavOpen && (
            <div className="space-y-2 pb-3 lg:hidden">
              <nav className="grid grid-cols-3 gap-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-center text-sm font-medium text-slate-900"
                      : "rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  }
                >
                  {t(`nav.${item.key}`)}
                </NavLink>
              ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4">
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
    </div>
  );
}
