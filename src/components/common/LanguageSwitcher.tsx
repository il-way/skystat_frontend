import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type LanguageCode = "ko" | "en" | "ja";

type LanguageSwitcherProps = {
  className?: string;
};

const LANGUAGE_CODES: LanguageCode[] = ["ko", "en", "ja"];

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "ko").split("-")[0] as LanguageCode;

  return (
    <label className={cn("inline-flex items-center gap-1.5 text-xs text-slate-600", className)}>
      <span className="sr-only">{t("language.label")}</span>
      <select
        aria-label={t("language.label")}
        value={current}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value);
        }}
        className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-400"
      >
        {LANGUAGE_CODES.map((code) => (
          <option key={code} value={code}>
            {t(`language.${code}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
