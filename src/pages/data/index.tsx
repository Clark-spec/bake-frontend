import { useState } from "react";
import type { ReactNode } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useRecordCounts } from "@/hooks/useRecordCounts";
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
} from "@/services/customer.service";
import { createOrder, deleteOrder, listOrders } from "@/services/order.service";
import { listProducts } from "@/services/product.service";
import { createWeeklySale, deleteWeeklySale, listWeeklySales } from "@/services/weeklySale.service";
import { createExpense, deleteExpense, listExpenses } from "@/services/expense.service";
import { createPromotion, deletePromotion, listPromotions } from "@/services/promotion.service";
import { getErrorMessage } from "@/services/api";
import { PageHeader } from "@/components/common/PageHeader";
import { CountBadge } from "@/components/data/CountBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field, Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Reveal } from "@/components/ui/reveal";
import { useToast } from "@/components/ui/toast";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state";
import { Table, Td, Th } from "@/components/ui/table";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDatabase,
  IconPlus,
  IconTrash,
} from "@/components/ui/icons";
import { formatCurrency, formatDate, formatNumber } from "@/utils/format";
import type { Customer, Expense, Order, PaginationMeta, Promotion, WeeklySale } from "@/types";

interface FieldDef {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  numeric?: boolean;
  options?: { value: string | number; label: string }[];
}

interface ColumnDef<T> {
  header: string;
  render: (row: T) => ReactNode;
}

const today = () => new Date().toISOString().slice(0, 10);

function ResourcePanel<T extends { id: number }>({
  keyPrefix,
  singular,
  fields,
  columns,
  fetchPage,
  createRecord,
  deleteRecord,
  rowLabel,
  onMutated,
}: {
  keyPrefix: string;
  singular: string;
  fields: FieldDef[];
  columns: ColumnDef<T>[];
  fetchPage: (page: number) => Promise<{ data: T[]; meta: PaginationMeta }>;
  createRecord: (values: Record<string, string | number>) => Promise<unknown>;
  deleteRecord: (id: number) => Promise<unknown>;
  rowLabel: (row: T) => string;
  onMutated: () => void;
}) {
  const [page, setPage] = useState(1);
  const query = useFetch(() => fetchPage(page), `${keyPrefix}:${page}`);
  const [values, setValues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingPayload, setPendingPayload] = useState<Record<string, string | number> | null>(null);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const fieldValue = (field: FieldDef) =>
    values[field.name] ??
    (field.type === "date"
      ? today()
      : field.type === "select"
        ? String(field.options?.[0]?.value ?? "")
        : "");

  const optionLabel = (field: FieldDef, raw: string | number | undefined) => {
    const match = field.options?.find((option) => String(option.value) === String(raw));
    return match?.label ?? String(raw ?? "—");
  };

  const summaryValue = (field: FieldDef, raw: string | number) => {
    if (field.options) return optionLabel(field, raw);
    if (field.type === "date") return formatDate(String(raw));
    if (field.numeric) return formatNumber(Number(raw), Number.isInteger(Number(raw)) ? 0 : 2);
    return String(raw);
  };

  const requestCreate = () => {
    setFormError(null);
    const payload: Record<string, string | number> = {};
    for (const field of fields) {
      const raw = fieldValue(field).trim();
      if (field.name === "note" && !raw) continue;
      if (!raw) {
        setFormError(`Please fill in “${field.label}”.`);
        return;
      }
      if (field.numeric) {
        const numeric = Number(raw);
        if (!Number.isFinite(numeric)) {
          setFormError(`“${field.label}” must be a number.`);
          return;
        }
        payload[field.name] = numeric;
      } else {
        payload[field.name] = raw;
      }
    }
    setPendingPayload(payload);
  };

  const confirmCreate = async () => {
    if (!pendingPayload) return;
    setCreating(true);
    try {
      await createRecord(pendingPayload);
      setValues({});
      setPendingPayload(null);
      if (page !== 1) {
        setPage(1);
      } else {
        query.refetch();
      }
      onMutated();
      toast({
        tone: "success",
        title: `${singular} added`,
        description: "The record is saved and the dashboards will include it.",
      });
    } catch (error) {
      const message = getErrorMessage(error);
      setPendingPayload(null);
      setFormError(message);
      toast({
        tone: "error",
        title: `Could not add ${singular.toLowerCase()}`,
        description: message,
      });
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const label = rowLabel(pendingDelete);
    try {
      await deleteRecord(pendingDelete.id);
      setPendingDelete(null);
      if (query.data && query.data.data.length === 1 && page > 1) {
        setPage((value) => value - 1);
      } else {
        query.refetch();
      }
      onMutated();
      toast({ tone: "success", title: `${singular} deleted`, description: label });
    } catch (error) {
      toast({
        tone: "error",
        title: `Could not delete ${singular.toLowerCase()}`,
        description: getErrorMessage(error),
      });
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = query.data
    ? Math.max(1, Math.ceil(query.data.meta.total / query.data.meta.limit))
    : 1;
  const total = query.data?.meta.total ?? 0;
  const limit = query.data?.meta.limit ?? 10;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="space-y-5">
      <Reveal>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            requestCreate();
          }}
          className="glass rounded-3xl p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-[0_10px_22px_-12px_rgba(180,83,9,0.9)]">
                <IconPlus className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-[0.95rem] font-semibold text-stone-800">
                  New {singular.toLowerCase()}
                </h3>
                <p className="text-xs text-stone-500">You will confirm the values before saving.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/50 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-stone-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Validation on
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fields.map((field) => (
              <Field key={field.name} label={field.label}>
                {field.type === "select" ? (
                  <Select
                    value={fieldValue(field)}
                    onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    type={field.type}
                    value={fieldValue(field)}
                    placeholder={field.type === "text" ? field.label : undefined}
                    onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                  />
                )}
              </Field>
            ))}
          </div>

          {formError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-rose-200/70 bg-rose-50/70 px-3 py-2 text-sm text-rose-700"
            >
              {formError}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={creating}>
              <IconPlus className="h-4 w-4" />
              Add record
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setValues({});
                setFormError(null);
              }}
            >
              Clear fields
            </Button>
          </div>
        </form>
      </Reveal>

      {query.loading && <TableSkeleton rows={8} columns={columns.length + 1} />}
      {query.error && <ErrorState message={query.error} onRetry={query.refetch} />}
      {query.data && query.data.data.length === 0 && (
        <EmptyState
          message="No records yet."
          hint={`Add a ${singular.toLowerCase()} with the form above to get started.`}
        />
      )}

      {query.data && query.data.data.length > 0 && (
        <Reveal delay={80}>
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/70 bg-white/55 text-stone-500">
                  <IconDatabase className="h-4 w-4" />
                </span>
                <h3 className="text-[0.95rem] font-semibold text-stone-800">
                  {singular} records
                </h3>
              </div>
              <span className="text-xs font-medium text-stone-400">
                Page {query.data.meta.page} of {totalPages}
              </span>
            </div>

            <div className="mt-4">
              <Table>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <Th key={column.header}>{column.header}</Th>
                    ))}
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.data.map((row, index) => (
                    <tr
                      key={row.id}
                      className="animate-row-in"
                      style={{ animationDelay: `${Math.min(index, 9) * 30}ms` }}
                    >
                      {columns.map((column) => (
                        <Td key={column.header}>{column.render(row)}</Td>
                      ))}
                      <Td className="text-right">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setPendingDelete(row)}
                          aria-label={`Delete ${rowLabel(row)}`}
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone-500">
                Showing{" "}
                <span className="font-semibold text-stone-700">
                  {formatNumber(from)}–{formatNumber(to)}
                </span>{" "}
                of <span className="font-semibold text-stone-700">{formatNumber(total)}</span> records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  <IconChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="rounded-xl border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-semibold tabular-nums text-stone-600">
                  {query.data.meta.page} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </Reveal>
      )}

      <ConfirmDialog
        open={pendingPayload !== null}
        title={`Add this ${singular.toLowerCase()}?`}
        description={
          <div className="space-y-3">
            <p>Review the values before saving the new record.</p>
            <dl className="rounded-2xl border border-white/70 bg-white/50 p-3">
              {pendingPayload &&
                fields.map((field) => {
                  const value = pendingPayload[field.name];
                  if (value === undefined) return null;
                  return (
                    <div
                      key={field.name}
                      className="flex items-start justify-between gap-4 py-0.5 text-sm"
                    >
                      <dt className="text-stone-500">{field.label}</dt>
                      <dd className="text-right font-semibold text-stone-800">
                        {summaryValue(field, value)}
                      </dd>
                    </div>
                  );
                })}
            </dl>
          </div>
        }
        confirmLabel="Add record"
        loading={creating}
        onConfirm={confirmCreate}
        onCancel={() => setPendingPayload(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        tone="danger"
        title={`Delete this ${singular.toLowerCase()}?`}
        description={
          <div className="space-y-3">
            <p>
              <span className="font-semibold text-stone-800">
                {pendingDelete ? rowLabel(pendingDelete) : "This record"}
              </span>{" "}
              will be permanently removed.
            </p>
            <p className="rounded-xl border border-rose-200/70 bg-rose-50/70 px-3 py-2 text-sm text-rose-700">
              This action cannot be undone.
            </p>
          </div>
        }
        confirmLabel="Delete record"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default function DataPage() {
  const counts = useRecordCounts();
  const productsQuery = useFetch(() => listProducts(), "data-products");
  const customersQuery = useFetch(() => listCustomers(1, 100), "data-customers");

  const [active, setActive] = useState("customers");

  const countFor = (key: string) => counts.data?.find((item) => item.key === key);
  const products = productsQuery.data ?? [];
  const customers = customersQuery.data?.data ?? [];

  const badge = (key: string) => {
    const item = countFor(key);
    return item ? ` (${item.count})` : "";
  };

  const tabs = [
    { key: "customers", label: `Customers${badge("customers")}` },
    { key: "orders", label: `Orders${badge("orders")}` },
    { key: "weeklySales", label: `Weekly Sales${badge("weeklySales")}` },
    { key: "expenses", label: `Expenses${badge("expenses")}` },
    { key: "promotions", label: `Promotions${badge("promotions")}` },
  ];

  const productOptions = products.map((product) => ({ value: product.id, label: product.name }));
  const customerOptions = customers.map((customer) => ({ value: customer.id, label: customer.name }));

  return (
    <div>
      <PageHeader
        eyebrow="Database records"
        title="Data Management"
        description="View, add, and delete records. Every required table shows a count badge against the 50-record minimum."
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3.5 py-1.5 text-xs font-semibold text-stone-600 shadow-sm backdrop-blur-md">
          <IconDatabase className="h-4 w-4 text-amber-700" />
          5 managed tables
        </span>
      </PageHeader>

      <Reveal className="mb-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-stone-500">
            Record coverage
          </p>
          <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-stone-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
            Synced with the API
          </span>
        </div>
      </Reveal>

      <div className="mb-5 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {counts.data
          ? counts.data.map((item, index) => (
              <Reveal key={item.key} className="h-full" delay={60 + index * 60}>
                <div className="glass-soft flex h-full flex-col justify-between gap-2 rounded-2xl px-3.5 py-2.5">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-stone-500">
                    {item.label}
                  </span>
                  <CountBadge
                    count={item.count}
                    minimum={item.minimumRequired}
                    meetsMinimum={item.meetsMinimum}
                  />
                </div>
              </Reveal>
            ))
          : Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="glass-soft flex flex-col justify-between gap-2 rounded-2xl px-3.5 py-2.5"
              >
                <div className="skeleton h-3 w-16 rounded-full" />
                <div className="skeleton h-3 w-24 rounded-full" />
              </div>
            ))}
      </div>

      <Reveal>
        <Tabs items={tabs} active={active} onChange={setActive} />
      </Reveal>

      <div className="mt-5">
        {active === "customers" && (
          <ResourcePanel<Customer>
            keyPrefix="customers"
            singular="Customer"
            fields={[
              { name: "name", label: "Name", type: "text" },
              {
                name: "type",
                label: "Type",
                type: "select",
                options: [
                  { value: "WALK_IN", label: "Walk-in" },
                  { value: "REGULAR", label: "Regular" },
                  { value: "RESELLER", label: "Reseller" },
                ],
              },
              { name: "area", label: "Area", type: "text" },
            ]}
            columns={[
              { header: "Name", render: (row) => <span className="font-medium text-stone-800">{row.name}</span> },
              {
                header: "Type",
                render: (row) => (
                  <span className="rounded-full border border-white/70 bg-white/50 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                    {row.type.replace("_", "-")}
                  </span>
                ),
              },
              { header: "Area", render: (row) => row.area },
            ]}
            fetchPage={(page) => listCustomers(page, 10)}
            createRecord={(values) => createCustomer(values as { name: string; type: string; area: string })}
            deleteRecord={deleteCustomer}
            rowLabel={(row) => row.name}
            onMutated={counts.refetch}
          />
        )}

        {active === "orders" && (
          <ResourcePanel<Order>
            keyPrefix="orders"
            singular="Order"
            fields={[
              { name: "customerId", label: "Customer", type: "select", numeric: true, options: customerOptions },
              { name: "productId", label: "Product", type: "select", numeric: true, options: productOptions },
              { name: "quantity", label: "Quantity", type: "number", numeric: true },
              {
                name: "channel",
                label: "Channel",
                type: "select",
                options: [
                  { value: "STORE", label: "Store" },
                  { value: "PRE_ORDER", label: "Pre-order" },
                  { value: "DELIVERY", label: "Delivery" },
                ],
              },
              { name: "orderDate", label: "Order date", type: "date" },
            ]}
            columns={[
              { header: "Customer", render: (row) => <span className="font-medium text-stone-800">{row.customerName ?? `#${row.customerId}`}</span> },
              { header: "Product", render: (row) => row.productName ?? `#${row.productId}` },
              { header: "Qty", render: (row) => <span className="tabular-nums">{formatNumber(row.quantity)}</span> },
              { header: "Channel", render: (row) => row.channel.replace("_", "-") },
              { header: "Date", render: (row) => formatDate(row.orderDate) },
              { header: "Total", render: (row) => <span className="tabular-nums">{formatCurrency(row.totalAmount)}</span> },
            ]}
            fetchPage={(page) => listOrders(page, 10)}
            createRecord={(values) =>
              createOrder(values as { customerId: number; productId: number; quantity: number; channel: string; orderDate: string })
            }
            deleteRecord={deleteOrder}
            rowLabel={(row) => `Order #${row.id} · ${row.customerName ?? `customer #${row.customerId}`}`}
            onMutated={counts.refetch}
          />
        )}

        {active === "weeklySales" && (
          <ResourcePanel<WeeklySale>
            keyPrefix="weeklySales"
            singular="Weekly sale"
            fields={[
              { name: "productId", label: "Product", type: "select", numeric: true, options: productOptions },
              { name: "weekStart", label: "Week start", type: "date" },
              { name: "unitsSold", label: "Units sold", type: "number", numeric: true },
            ]}
            columns={[
              { header: "Product", render: (row) => <span className="font-medium text-stone-800">{row.productName ?? `#${row.productId}`}</span> },
              { header: "Week", render: (row) => formatDate(row.weekStart) },
              { header: "Units", render: (row) => <span className="tabular-nums">{formatNumber(row.unitsSold)}</span> },
              { header: "Revenue", render: (row) => <span className="tabular-nums">{formatCurrency(row.revenue)}</span> },
            ]}
            fetchPage={(page) => listWeeklySales(page, 10)}
            createRecord={(values) => createWeeklySale(values as { productId: number; weekStart: string; unitsSold: number })}
            deleteRecord={deleteWeeklySale}
            rowLabel={(row) => `${row.productName ?? `Product #${row.productId}`} · week of ${formatDate(row.weekStart)}`}
            onMutated={counts.refetch}
          />
        )}

        {active === "expenses" && (
          <ResourcePanel<Expense>
            keyPrefix="expenses"
            singular="Expense"
            fields={[
              {
                name: "category",
                label: "Category",
                type: "select",
                options: [
                  { value: "INGREDIENTS", label: "Ingredients" },
                  { value: "UTILITIES", label: "Utilities" },
                  { value: "PACKAGING", label: "Packaging" },
                  { value: "LABOR", label: "Labor" },
                ],
              },
              { name: "description", label: "Description", type: "text" },
              { name: "amount", label: "Amount", type: "number", numeric: true },
              { name: "expenseDate", label: "Expense date", type: "date" },
            ]}
            columns={[
              { header: "Category", render: (row) => row.category },
              { header: "Description", render: (row) => <span className="font-medium text-stone-800">{row.description}</span> },
              { header: "Amount", render: (row) => <span className="tabular-nums">{formatCurrency(row.amount)}</span> },
              { header: "Date", render: (row) => formatDate(row.expenseDate) },
            ]}
            fetchPage={(page) => listExpenses(page, 10)}
            createRecord={(values) =>
              createExpense(values as { category: string; description: string; amount: number; expenseDate: string })
            }
            deleteRecord={deleteExpense}
            rowLabel={(row) => `${row.description} · ${formatCurrency(row.amount)}`}
            onMutated={counts.refetch}
          />
        )}

        {active === "promotions" && (
          <ResourcePanel<Promotion>
            keyPrefix="promotions"
            singular="Promotion"
            fields={[
              {
                name: "channel",
                label: "Channel",
                type: "select",
                options: [
                  { value: "FACEBOOK", label: "Facebook" },
                  { value: "FLYERS", label: "Flyers" },
                  { value: "RADIO", label: "Radio" },
                  { value: "REFERRAL", label: "Referral" },
                ],
              },
              { name: "weekStart", label: "Week start", type: "date" },
              { name: "spend", label: "Spend", type: "number", numeric: true },
              { name: "note", label: "Note", type: "text" },
            ]}
            columns={[
              { header: "Channel", render: (row) => <span className="font-medium text-stone-800">{row.channel}</span> },
              { header: "Week", render: (row) => formatDate(row.weekStart) },
              { header: "Spend", render: (row) => <span className="tabular-nums">{formatCurrency(row.spend)}</span> },
              { header: "Note", render: (row) => row.note ?? "—" },
            ]}
            fetchPage={(page) => listPromotions(page, 10)}
            createRecord={(values) =>
              createPromotion(values as { channel: string; weekStart: string; spend: number; note?: string })
            }
            deleteRecord={deletePromotion}
            rowLabel={(row) => `${row.channel} · week of ${formatDate(row.weekStart)}`}
            onMutated={counts.refetch}
          />
        )}
      </div>
    </div>
  );
}
