import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { FormField } from "../../components/ui/FormField";
import { Icon } from "../../components/layout/Icon";
import { Avatar } from "../../components/ui/Avatar";
import type { Role } from "../../types";
import { toast } from "sonner";

const SEED = [
  { id: "u-1", name: "Alice Admin",   email: "admin@confiance-app.com",      phone: "+237 622 00 00 01", role: "ADMIN" as Role,               status: "active" },
  { id: "u-2", name: "Paul Mbala",    email: "supervisor@confiance-app.com", phone: "+237 622 00 00 02", role: "DISPATCH_SUPERVISOR" as Role, status: "active" },
  { id: "u-3", name: "Marie Nguemo",  email: "agent@confiance-app.com",      phone: "+237 622 00 00 03", role: "DISPATCH_AGENT" as Role,      status: "active" },
  { id: "u-4", name: "Clément Ondoa", email: "agent2@confiance-app.com",     phone: "+237 622 00 00 11", role: "DISPATCH_AGENT" as Role,      status: "active" },
  { id: "u-5", name: "Joseph Fotso",  email: "fleet@confiance-app.com",      phone: "+237 622 00 00 04", role: "FLEET_MANAGER" as Role,       status: "active" },
  { id: "u-6", name: "Jean Dibango",  email: "driver@confiance-app.com",     phone: "+237 622 00 00 05", role: "DRIVER" as Role,              status: "active" },
  { id: "u-7", name: "Marc Lontsi",   email: "marc@confiance-app.com",       phone: "+237 622 00 00 06", role: "DRIVER" as Role,              status: "active" },
  { id: "u-8", name: "Sophie Ragon",  email: "sophie@confiance-app.com",     phone: "+237 622 00 00 07", role: "DRIVER" as Role,              status: "inactive" },
];

export default function Users() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"" | Role>("");
  const [open, setOpen] = useState(false);

  const rows = SEED.filter((u) => {
    if (role && u.role !== role) return false;
    if (q) {
      const s = q.toLowerCase();
      return [u.name, u.email, u.phone].some((x) => x.toLowerCase().includes(s));
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title={t("nav.users")}
        subtitle={`${rows.length} utilisateur(s)`}
        actions={<Button leftIcon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>Ajouter</Button>}
      />

      <Card className="mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search") as string} leftIcon={<Icon name="search" size={16} />} />
          </div>
          <div className="w-56">
            <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="">Rôle · {t("common.all")}</option>
              {(["ADMIN","DISPATCH_SUPERVISOR","DISPATCH_AGENT","FLEET_MANAGER","DRIVER"] as Role[]).map((r) => (
                <option key={r} value={r}>{t(`role.${r}`)}</option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          columns={[
            { key: "user", header: t("common.profile"), cell: (r) => (
              <div className="flex items-center gap-3">
                <Avatar name={r.name} />
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{r.name}</p>
                  <p className="text-[12px] text-[color:var(--color-muted)]">{r.email}</p>
                </div>
              </div>
            )},
            { key: "phone", header: t("common.phone"), cell: (r) => <span className="text-[13px]">{r.phone}</span> },
            { key: "role",  header: "Rôle",            cell: (r) => <Badge tone="brand">{t(`role.${r.role}`)}</Badge> },
            { key: "st",    header: t("common.status"),cell: (r) => <Badge tone={r.status === "active" ? "success" : "neutral"}>{t(`user.status.${r.status}`)}</Badge> },
            { key: "act",   header: "", align: "right",cell: () => (
              <div className="flex items-center justify-end gap-1">
                <Button size="icon" variant="ghost" aria-label="edit"><Icon name="edit" size={16} /></Button>
                <Button size="icon" variant="ghost" aria-label="trash"><Icon name="trash" size={16} /></Button>
              </div>
            )},
          ]}
        />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nouvel utilisateur"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={() => { setOpen(false); toast.success("Utilisateur créé"); }}>{t("common.create")}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nom complet" required className="sm:col-span-2"><Input /></FormField>
          <FormField label={t("common.email")} required><Input type="email" /></FormField>
          <FormField label={t("common.phone")} required><Input /></FormField>
          <FormField label="Rôle" required className="sm:col-span-2">
            <Select required defaultValue="">
              <option value="" disabled>Sélectionner...</option>
              {(["ADMIN","DISPATCH_SUPERVISOR","DISPATCH_AGENT","FLEET_MANAGER","DRIVER"] as Role[]).map((r) => (
                <option key={r} value={r}>{t(`role.${r}`)}</option>
              ))}
            </Select>
          </FormField>
          <FormField label={t("common.password")} required className="sm:col-span-2"><Input type="password" /></FormField>
        </div>
      </Modal>
    </div>
  );
}
