import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { IconRefresh, IconSliders } from "@/components/ui/icons";
import type { Product } from "@/types";

export interface DashboardFilters {
  from: string;
  to: string;
  productId: string;
}

export function FilterBar({
  filters,
  products,
  onChange,
  onReset,
}: {
  filters: DashboardFilters;
  products: Product[];
  onChange: (filters: DashboardFilters) => void;
  onReset: () => void;
}) {
  return (
    <div className="glass rounded-3xl p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-stone-500">
          <IconSliders className="h-4 w-4 text-amber-700" />
          Filters
        </p>
        <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-stone-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
          Applies instantly
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="From">
          <Input
            type="date"
            value={filters.from}
            onChange={(event) => onChange({ ...filters, from: event.target.value })}
          />
        </Field>
        <Field label="To">
          <Input
            type="date"
            value={filters.to}
            onChange={(event) => onChange({ ...filters, to: event.target.value })}
          />
        </Field>
        <Field label="Product">
          <Select
            value={filters.productId}
            onChange={(event) => onChange({ ...filters, productId: event.target.value })}
          >
            <option value="">All products</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex items-end">
          <Button variant="secondary" onClick={onReset} className="w-full">
            <IconRefresh className="h-4 w-4" />
            Reset filters
          </Button>
        </div>
      </div>
    </div>
  );
}
