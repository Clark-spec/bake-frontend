export const formatCurrency = (value: number | null | undefined) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value ?? 0);

export const formatNumber = (value: number | null | undefined, digits = 0) =>
  new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value ?? 0);

export const formatPercent = (value: number | null | undefined, digits = 1) =>
  `${(value ?? 0).toFixed(digits)}%`;

export const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
};
