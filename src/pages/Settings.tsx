import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function Settings() {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <PageHeader title={t("common.settings")} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t("common.language")} subtitle={i18n.language} />
          <div className="flex items-center gap-2">
            <Button variant={i18n.language.startsWith("fr") ? "primary" : "outline"} onClick={() => i18n.changeLanguage("fr")}>Français</Button>
            <Button variant={i18n.language.startsWith("en") ? "primary" : "outline"} onClick={() => i18n.changeLanguage("en")}>English</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title={t("common.notifications")} subtitle="Email, SMS, in-app" />
          <p className="text-[13px] text-[color:var(--color-muted)]">
            Les préférences de notifications seront disponibles dans une prochaine version.
          </p>
        </Card>
      </div>
    </div>
  );
}
