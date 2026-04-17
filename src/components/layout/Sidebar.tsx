import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MODULES_BY_ROLE, NAV_BY_ROLE, type ModuleKey } from "./nav-config";
import { useAuth } from "../../lib/auth";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { cn } from "../../lib/utils";

interface Props {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: Props) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const modules = MODULES_BY_ROLE[user.role];

  const detectModule = (pathname: string): ModuleKey | null => {
    if (!modules) return null;
    const found = modules.find((m) =>
      m.sections.some((s) => s.items.some((item) => pathname.startsWith(item.to)))
    );
    return found?.key ?? null;
  };

  const [activeModule, setActiveModule] = useState<ModuleKey>(
    () => detectModule(location.pathname) ?? (modules?.[0]?.key ?? "fleet")
  );

  useEffect(() => {
    const detected = detectModule(location.pathname);
    if (detected) setActiveModule(detected);
  }, [location.pathname]);

  const sections = modules
    ? (modules.find((m) => m.key === activeModule)?.sections ?? [])
    : NAV_BY_ROLE[user.role];

  const handleLogout = () => {
    logout();
    onNavigate?.();
    nav("/login", { replace: true });
  };

  return (
    <aside className="h-full w-[260px] shrink-0 bg-brand-500 text-white flex flex-col">
      <div className="h-16 px-5 flex items-center border-b border-white/10">
        <Logo size="sm" onDark />
      </div>

      {modules && (
        <div className="px-3 pt-3 pb-1 flex gap-1.5">
          {modules.map((m) => (
            <button
              key={m.key}
              onClick={() => {
                setActiveModule(m.key);
                const first = m.sections[0]?.items[0]?.to;
                if (first) nav(first);
                onNavigate?.();
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 h-9 rounded-md text-[12px] font-semibold transition-base",
                activeModule === m.key
                  ? "bg-white text-brand-500 shadow-sm"
                  : "text-white/65 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon name={m.iconKey} size={14} strokeWidth={2} />
              {m.label}
            </button>
          ))}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={
                      item.to === `/${user.role.toLowerCase().replace(/_/g, "-")}` ||
                      item.to === "/admin" ||
                      item.to === "/fleet" ||
                      item.to === "/driver" ||
                      item.to === "/procurement"
                    }
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 h-10 px-3 rounded-md text-[13.5px] font-medium transition-base",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                      )
                    }
                  >
                    <Icon name={item.iconKey} size={18} strokeWidth={1.6} />
                    <span className="truncate">{t(item.label)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="h-9 w-9 rounded-full bg-white/10 text-white flex items-center justify-center text-[12px] font-semibold">
            {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium truncate">{user.name}</p>
            <p className="text-[11px] text-white/60 truncate">{t(`role.${user.role}`)}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 h-10 px-3 rounded-md text-[13.5px] font-medium transition-base",
            "text-white/75 hover:bg-white/10 hover:text-white",
          )}
        >
          <Icon name="logout" size={18} strokeWidth={1.6} />
          <span className="truncate">{t("common.logout")}</span>
        </button>
      </div>
    </aside>
  );
}
