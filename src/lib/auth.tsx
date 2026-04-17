import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role, User } from "../types";

const DEMO_USERS: (User & { password: string })[] = [
  { id: "u-admin",  name: "Alice Admin",        email: "admin@confiance-app.com",      phone: "+237 622 000 001", role: "ADMIN",               password: "demo" },
  { id: "u-sup",    name: "Paul Mbala",         email: "supervisor@confiance-app.com", phone: "+237 622 000 002", role: "DISPATCH_SUPERVISOR", password: "demo", department: "DISPATCH" },
  { id: "u-agent",  name: "Marie Nguemo",       email: "agent@confiance-app.com",      phone: "+237 622 000 003", role: "DISPATCH_AGENT",      password: "demo", department: "DISPATCH" },
  { id: "u-fleet",  name: "Joseph Fotso",       email: "fleet@confiance-app.com",      phone: "+237 622 000 004", role: "FLEET_MANAGER",       password: "demo", department: "FLEET" },
  { id: "u-drv",    name: "Jean Dibango",       email: "driver@confiance-app.com",     phone: "+237 622 000 005", role: "DRIVER",              password: "demo" },
];

interface AuthCtx {
  user: User | null;
  login: (identifier: string, password: string) => Promise<User | null>;
  logout: () => void;
  demoUsers: { email: string; phone: string; role: Role; name: string }[];
}

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "confiance.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = useCallback(async (identifier: string, password: string) => {
    await new Promise((r) => setTimeout(r, 350));
    const id = identifier.trim().toLowerCase();
    const found = DEMO_USERS.find(
      (u) => (u.email.toLowerCase() === id || u.phone.replace(/\s/g, "") === id.replace(/\s/g, "")) && u.password === password,
    );
    if (!found) return null;
    const { password: _pw, ...safe } = found;
    setUser(safe);
    return safe;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    login,
    logout,
    demoUsers: DEMO_USERS.map(({ email, phone, role, name }) => ({ email, phone, role, name })),
  }), [user, login, logout]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}

export function roleHome(role: Role): string {
  switch (role) {
    case "ADMIN": return "/admin";
    case "DISPATCH_SUPERVISOR": return "/dispatch-supervisor";
    case "DISPATCH_AGENT": return "/dispatch-agent";
    case "FLEET_MANAGER": return "/fleet";
    case "DRIVER": return "/driver";
  }
}
