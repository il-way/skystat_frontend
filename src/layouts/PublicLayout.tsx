import { Link, NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/about", label: "About" },
  { to: "/guide", label: "Guide" },
  { to: "/faq", label: "FAQ" },
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
              SkyStat
            </Link>

            <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "text-slate-900 underline underline-offset-4" : "hover:text-slate-900"
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <Link
              to="/dashboard"
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Dashboard
            </Link>
          </div>
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
            <p>SkyStat public weather statistics</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                to="/about"
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                About
              </Link>
              <Link
                to="/privacy"
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                개인정보처리방침
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                문의하기
              </Link>
              <Link
                to="/terms"
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                이용약관
              </Link>
            </div>
            <p>&copy; {new Date().getFullYear()} SkyStat</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
