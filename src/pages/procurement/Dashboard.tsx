import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { DonutChart } from "../../components/charts/DonutChart";
import { BarChart } from "../../components/charts/BarChart";
import { purchaseRequests, suppliers, expenses, expensesByCategory, expensesByDepartment } from "../../lib/mock-data";
import { formatCurrency, formatDate } from "../../lib/utils";

const STATUS_TONE = {
  PENDING:  "warning",
  APPROVED: "success",
  REJECTED: "danger",
} as const;

export default function ProcurementDashboard() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const totalExpenses    = expenses.reduce((s, e) => s + e.amount, 0);
  const pendingRequests  = purchaseRequests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = purchaseRequests.filter((r) => r.status === "APPROVED").length;
  const activeSuppliers  = suppliers.filter((s) => s.status === "ACTIVE").length;

  const recent = [...purchaseRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div>
      <PageHeader
        title={t("procurement.title")}
        subtitle={t("procurement.dashboard.recentRequests")}
        actions={<Badge tone="brand">{t("common.realtime")}</Badge>}
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          label={t("procurement.dashboard.totalExpenses")}
          value={formatCurrency(totalExpenses)}
          icon={<Icon name="money" size={22} />}
          footnote={`${expenses.length} dépenses`}
        />
        <StatCard
          label={t("procurement.dashboard.pendingRequests")}
          value={pendingRequests}
          icon={<Icon name="clock" size={22} />}
        />
        <StatCard
          label={t("procurement.dashboard.approvedRequests")}
          value={approvedRequests}
          icon={<Icon name="check" size={22} />}
        />
        <StatCard
          label={t("procurement.dashboard.activeSuppliers")}
          value={activeSuppliers}
          icon={<Icon name="store" size={22} />}
          footnote={`${suppliers.length} total`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title={t("procurement.dashboard.byDepartment")} />
          <BarChart data={expensesByDepartment()} horizontal />
        </Card>
        <Card>
          <CardHeader title={t("procurement.dashboard.byCategory")} />
          <DonutChart data={expensesByCategory()} />
        </Card>
      </div>

      <Card>
        <CardHeader title={t("procurement.dashboard.recentRequests")} />
        <ul className="divide-y divide-[color:var(--color-border-soft)]">
          {recent.map((r) => (
            <li
              key={r.id}
              onClick={() => nav("/procurement/requests")}
              className="py-3 flex items-center gap-4 cursor-pointer hover:bg-[color:var(--color-surface-raised)] px-1 rounded-md transition-base"
            >
              <span className="h-9 w-9 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                <Icon name={r.type === "service" ? "box" : "cart"} size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-ink truncate">{r.description}</p>
                <p className="text-[12px] text-[color:var(--color-muted)]">
                  {r.requester} · {r.department} · {formatDate(r.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[13px] font-medium tabular-nums">{formatCurrency(r.estimatedAmount)}</span>
                <Badge tone={STATUS_TONE[r.status]}>{t(`procurement.request.status.${r.status}`)}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
