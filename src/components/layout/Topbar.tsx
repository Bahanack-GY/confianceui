import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "./Icon";
import { Input } from "../ui/Input";
import { useAuth } from "../../lib/auth";
import { cn } from "../../lib/utils";

interface Props {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: Props) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggleLang = () => {
    const next = i18n.language.startsWith("fr") ? "en" : "fr";
    void i18n.changeLanguage(next);
  };

  const handleLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <header className="h-16 shrink-0 bg-white border-b border-[color:var(--color-border-soft)] flex items-center gap-4 px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-[10px] text-ink-soft hover:bg-[#f1f3f8] transition-base"
        aria-label="Menu"
      >
        <Icon name="menu" size={20} />
      </button>

      <div className="flex-1 max-w-md hidden md:block">
        <Input
          placeholder={t("common.search") as string}
          leftIcon={<Icon name="search" size={16} />}
          className="h-10 bg-[color:var(--color-surface-alt)] border-transparent focus-within:border-brand-500 focus-within:bg-white"
        />
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1">
        <div className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-full bg-[#e8f7ee] text-success-500 text-[12px] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
          <span>{t("common.liveUpdates")}</span>
        </div>

        <button
          onClick={toggleLang}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-[10px] text-[13px] font-medium text-ink-soft hover:bg-[#f1f3f8] transition-base"
        >
          <Icon name="globe" size={16} />
          <span className="uppercase">{i18n.language.slice(0, 2)}</span>
        </button>

        <button className="inline-flex items-center justify-center h-10 w-10 rounded-[10px] text-ink-soft hover:bg-[#f1f3f8] transition-base relative">
          <Icon name="bell" size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger-500" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-2 h-10 pl-1 pr-3 rounded-[10px] hover:bg-[#f1f3f8] transition-base"
          >
            <span className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-[11px] font-semibold">
              {user?.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
            <span className="hidden sm:block text-[13px] font-medium text-ink-soft max-w-[160px] truncate">
              {user?.name}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[color:var(--color-border-soft)] rounded-[12px] shadow-[0_12px_40px_-12px_rgba(9,28,83,0.18)] py-1.5 z-40">
              <div className="px-3 py-2 border-b border-[color:var(--color-border-soft)]">
                <p className="text-[13px] font-medium text-ink truncate">{user?.name}</p>
                <p className="text-[11.5px] text-[color:var(--color-muted)] truncate">{user?.email}</p>
              </div>
              <MenuItem iconName="user"     label={t("common.profile")}  onClick={() => { setMenuOpen(false); nav("/profile"); }} />
              <MenuItem iconName="settings" label={t("common.settings")} onClick={() => { setMenuOpen(false); nav("/settings"); }} />
              <div className="h-px bg-[color:var(--color-border-soft)] my-1" />
              <MenuItem iconName="logout"   label={t("common.logout")}   onClick={handleLogout} danger />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ iconName, label, onClick, danger }: { iconName: string; label: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 h-9 px-3 text-[13px] transition-base",
        danger ? "text-danger-500 hover:bg-[#fbe9e9]" : "text-ink-soft hover:bg-[#f1f3f8]",
      )}
    >
      <Icon name={iconName} size={16} />
      {label}
    </button>
  );
}
