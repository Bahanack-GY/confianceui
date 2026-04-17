import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth, roleHome } from "../lib/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FormField } from "../components/ui/FormField";
import { Icon } from "../components/layout/Icon";
import { Logo } from "../components/layout/Logo";

const schema = z.object({
  identifier: z.string().min(3, "Requis"),
  password: z.string().min(3, "Requis"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { t, i18n } = useTranslation();
  const { login, demoUsers } = useAuth();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const user = await login(values.identifier, values.password);
    setSubmitting(false);
    if (!user) {
      toast.error(t("auth.invalidCredentials"));
      return;
    }
    toast.success(`${t("auth.welcome")}, ${user.name.split(" ")[0]}`);
    nav(roleHome(user.role), { replace: true });
  };

  const pickDemo = (email: string) => {
    setValue("identifier", email);
    setValue("password", "demo");
  };

  const toggleLang = () => void i18n.changeLanguage(i18n.language.startsWith("fr") ? "en" : "fr");

  return (
    <div className="min-h-full flex">
      {/* Left visual panel — flat, no gradient */}
      <aside className="hidden lg:flex w-1/2 bg-brand-500 text-white flex-col p-12 relative overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <Logo onDark size="lg" />
        </div>

        <div className="max-w-md">
          <h2 className="text-[34px] leading-[1.15] font-semibold">
            {i18n.language.startsWith("fr")
              ? "La maîtrise opérationnelle du transport premium."
              : "Operational mastery for premium transport."}
          </h2>
          <p className="mt-4 text-white/70 text-[14px] leading-relaxed">
            {i18n.language.startsWith("fr")
              ? "Dispatch, flotte et incidents, centralisés. Temps réel. Yaoundé."
              : "Dispatch, fleet and incidents, centralized. Real-time. Yaoundé."}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <Metric value="24/7" label={i18n.language.startsWith("fr") ? "Couverture" : "Coverage"} />
            <Metric value="< 3min" label={i18n.language.startsWith("fr") ? "Assignation" : "Assignment"} />
            <Metric value="98%" label={i18n.language.startsWith("fr") ? "Satisfaction" : "Satisfaction"} />
          </div>
        </div>

          <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute right-10 bottom-40 h-40 w-40 rounded-full bg-white/5" />
      </aside>

      <section className="flex-1 flex flex-col min-h-full">
        <div className="flex items-center justify-between px-6 lg:px-10 h-16">
          <div className="lg:hidden">
            <Logo />
          </div>
          <button
            onClick={toggleLang}
            className="ml-auto inline-flex items-center gap-1.5 h-9 px-3 rounded-[10px] text-[13px] font-medium text-ink-soft hover:bg-[#f1f3f8] transition-base"
          >
            <Icon name="globe" size={16} />
            <span className="uppercase">{i18n.language.slice(0, 2)}</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <h1 className="text-[26px] font-semibold text-ink">{t("auth.welcome")}</h1>
            <p className="text-[14px] text-[color:var(--color-muted)] mt-1">{t("auth.signInSubtitle")}</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
              <FormField label={t("common.emailOrPhone")} error={errors.identifier?.message}>
                <Input
                  type="text"
                  placeholder="name@confiance-app.com"
                  leftIcon={<Icon name="mail" size={16} />}
                  invalid={!!errors.identifier}
                  autoComplete="username"
                  {...register("identifier")}
                />
              </FormField>

              <FormField
                label={
                  <span className="flex items-center justify-between w-full">
                    <span>{t("common.password")}</span>
                    <a href="#" className="text-[12px] font-medium text-brand-500 hover:opacity-80">
                      {t("common.forgotPassword")}
                    </a>
                  </span>
                }
                error={errors.password?.message}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  leftIcon={<Icon name="lock" size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-[color:var(--color-muted)] hover:text-ink-soft transition-base"
                      aria-label="toggle password"
                    >
                      <Icon name={showPassword ? "close" : "check"} size={16} />
                    </button>
                  }
                  invalid={!!errors.password}
                  autoComplete="current-password"
                  {...register("password")}
                />
              </FormField>

              <Button type="submit" fullWidth size="lg" loading={submitting}>
                {t("common.signIn")}
              </Button>
            </form>

            <div className="mt-10">
              <p className="text-[12px] font-medium uppercase tracking-wide text-[color:var(--color-muted)] mb-3">
                {t("auth.useDemoAccount")}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {demoUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => pickDemo(u.email)}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 bg-white border border-[color:var(--color-border-soft)] rounded-[10px] text-left transition-base hover:bg-[#f6f7fb]"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink truncate">{u.name}</p>
                      <p className="text-[11.5px] text-[color:var(--color-muted)] truncate">{u.email}</p>
                    </div>
                    <span className="text-[11px] font-medium text-brand-500 bg-brand-50 px-2 py-1 rounded-full whitespace-nowrap">
                      {t(`role.${u.role}`)}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11.5px] text-[color:var(--color-muted-soft)]">
                {i18n.language.startsWith("fr") ? "Mot de passe de démo : " : "Demo password: "}
                <span className="font-mono text-[color:var(--color-muted)]">demo</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-[22px] font-semibold">{value}</p>
      <p className="text-[12px] text-white/60 mt-0.5">{label}</p>
    </div>
  );
}
