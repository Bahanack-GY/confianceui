import { useTranslation } from "react-i18next";
import { useAuth } from "../lib/auth";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader } from "../components/ui/Card";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/layout/Icon";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  if (!user) return null;

  return (
    <div>
      <PageHeader title={t("common.profile")} subtitle={user.email} />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <div className="flex flex-col items-center text-center py-4">
            <div className="h-20 w-20 rounded-full bg-brand-500 text-white flex items-center justify-center text-[22px] font-semibold">
              {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            <h3 className="mt-4 text-[16px] font-semibold text-ink">{user.name}</h3>
            <p className="text-[13px] text-[color:var(--color-muted)] mt-0.5">{t(`role.${user.role}`)}</p>
            <div className="mt-5 w-full text-left space-y-2 text-[13px]">
              <div className="flex items-center gap-2 text-ink-soft"><Icon name="mail" size={14} /> {user.email}</div>
              <div className="flex items-center gap-2 text-ink-soft"><Icon name="phone" size={14} /> {user.phone}</div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title={t("common.profile")} subtitle={t("common.settings")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("common.email")}><Input defaultValue={user.email} /></FormField>
            <FormField label={t("common.phone")}><Input defaultValue={user.phone} /></FormField>
            <FormField label="Nom complet" className="sm:col-span-2"><Input defaultValue={user.name} /></FormField>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>{t("common.save")}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
