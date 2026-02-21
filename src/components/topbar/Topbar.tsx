import type { TopbarProps } from "@/components/topbar/TopbarProps";
import { useState, type JSX } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Info, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AirportSearchModal from "../modal/AirportSearchModal";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";

const ANALYSIS_NAV_ITEMS = [
  { to: "/about", key: "about" },
  { to: "/guide", key: "guide" },
  { to: "/faq", key: "faq" },
  { to: "/terms", key: "terms" },
  { to: "/privacy", key: "privacy" },
  { to: "/contact", key: "contact" },
];

export default function Topbar(props: TopbarProps): JSX.Element {
  const { t } = useTranslation();
  const {
    icao,
    setIcao,
    from,
    setFrom,
    to,
    setTo,
    loading,
    isFetching,
    onFetch,
    rightSlot,
  } = props;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isDateInput = props.inputType === undefined;
  const fromValue = isDateInput ? from.split("T")[0] : from;
  const toValue = isDateInput ? to.split("T")[0] : to;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="lg:hidden" />
              <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
                SkyStat
              </Link>
            </div>

            <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex">
              {ANALYSIS_NAV_ITEMS.map((item) => (
                <Link key={item.to} to={item.to} className="hover:text-slate-900">
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                to="/"
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {t("actions.home")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-slate-50 pt-20">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="grid min-w-0 w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[auto_180px_1fr_1fr_auto] lg:items-end">
              <div className="flex min-w-0 items-center gap-2 lg:pr-2">
                <SidebarTrigger className="mr-1 hidden lg:inline-flex" />

                <div className="w-full">
                  <label className="mb-1 block text-xs text-slate-600">{t("labels.icao")}</label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={icao}
                      readOnly
                      onClick={() => setIsSearchOpen(true)}
                      placeholder={t("labels.airportCode")}
                      className="h-10 rounded-xl border-slate-300 bg-white pl-8 text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="mb-1 block text-xs text-slate-600">{t("labels.from")}</label>
                <Input
                  type={props.inputType ?? "date"}
                  value={fromValue}
                  onChange={(e) =>
                    props.inputType === undefined
                      ? setFrom(`${e.target.value}T00:00`)
                      : setFrom(e.target.value)
                  }
                  className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-200"
                />
              </div>

              <div className="w-full">
                <label className="mb-1 flex items-center gap-1 text-xs text-slate-600">
                  {t("labels.to")}
                  <span title={t("reportPage.header.toHint")}>
                    <Info className="h-3.5 w-3.5 text-slate-400 transition-colors hover:text-slate-600" />
                  </span>
                </label>
                <Input
                  type={props.inputType ?? "date"}
                  value={toValue}
                  onChange={(e) =>
                    props.inputType === undefined
                      ? setTo(`${e.target.value}T00:00`)
                      : setTo(e.target.value)
                  }
                  className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-200"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1 lg:justify-self-end">
                <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-end lg:justify-end">
                  {rightSlot ? rightSlot : null}
                  <Button
                    onClick={onFetch}
                    disabled={loading || isFetching}
                    className="h-10 w-full rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 lg:w-auto"
                  >
                    {loading || isFetching ? t("actions.loadingQuery") : t("actions.search")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AirportSearchModal
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        currentIcao={icao}
        onSelect={(selectedIcao) => {
          setIcao(selectedIcao);
        }}
      />
    </>
  );
}
