export type CustomerType = "WALK_IN" | "REGULAR" | "RESELLER";
export type OrderChannel = "STORE" | "PRE_ORDER" | "DELIVERY";
export type ExpenseCategory = "INGREDIENTS" | "UTILITIES" | "PACKAGING" | "LABOR";
export type PromoChannel = "FACEBOOK" | "FLYERS" | "RADIO" | "REFERRAL";
export type ForecastModelName = "MOVING_AVERAGE" | "EXP_SMOOTHING" | "LINEAR_TREND";

export interface Customer {
  id: number;
  name: string;
  type: CustomerType;
  area: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  unitCost: number;
  ovenMinutes: number;
  laborMinutes: number;
  flourGrams: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerName?: string | null;
  productId: number;
  productName?: string | null;
  quantity: number;
  channel: OrderChannel;
  orderDate: string;
  totalAmount: number;
}

export interface WeeklySale {
  id: number;
  productId: number;
  productName?: string | null;
  weekStart: string;
  unitsSold: number;
  revenue: number;
}

export interface Expense {
  id: number;
  category: ExpenseCategory;
  description: string;
  amount: number;
  expenseDate: string;
}

export interface Promotion {
  id: number;
  channel: PromoChannel;
  weekStart: string;
  spend: number;
  note?: string | null;
}

export interface ResourceLimit {
  id: number;
  key: string;
  label: string;
  unit: string;
  monthlyCapacity: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface RecordCount {
  key: string;
  label: string;
  count: number;
  minimumRequired: number;
  meetsMinimum: boolean;
}

export interface DescriptiveResult {
  kpis: {
    totalRevenue: number;
    totalUnits: number;
    totalOrders: number;
    averageOrderValue: number;
    totalExpenses: number;
    estimatedNetProfit: number;
  };
  revenueByWeek: { weekStart: string; revenue: number }[];
  revenueByProduct: { productId: number; product: string; revenue: number; units: number }[];
  unitsByCategory: { category: string; units: number }[];
  customersByType: { type: string; count: number }[];
  ordersByChannel: { channel: string; count: number; amount: number }[];
  expensesByCategory: { category: string; amount: number }[];
  promotionSpendByChannel: { channel: string; spend: number }[];
  productStats: {
    productId: number;
    product: string;
    category: string;
    weeks: number;
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
  }[];
  topCustomers: { customerId: number; customer: string; area: string; totalAmount: number }[];
  bestWeek: { weekStart: string; revenue: number };
}

export interface ForecastModelResult {
  name: ForecastModelName;
  mape: number;
  forecast: number[];
}

export interface ProductForecast {
  productId: number;
  product: string;
  history: { weekStart: string; units: number }[];
  models: ForecastModelResult[];
  bestModel: ForecastModelName;
  bestMape: number;
  monthlyForecast: number;
}

export interface PredictiveResult {
  horizon: number;
  validationWeeks: number;
  generatedAt: string;
  products: ProductForecast[];
}

export interface PlanRow {
  productId: number;
  product: string;
  category: string;
  forecastDemand: number;
  optimalUnits: number;
  baselineUnits: number;
  unitMargin: number;
  profit: number;
}

export interface ResourceUsage {
  key: string;
  label: string;
  unit: string;
  used: number;
  capacity: number;
  utilizationPercent: number;
  binding: boolean;
}

export interface PrescriptiveResult {
  status: string;
  horizon: number;
  capacities: Record<string, number>;
  optimalProfit: number;
  baselineProfit: number;
  improvement: { amount: number; percent: number };
  plan: PlanRow[];
  resourceUsage: ResourceUsage[];
}

export interface CaseSummaryResult {
  background: {
    recordCounts: Record<string, number>;
  };
  descriptive: {
    totalRevenue: number;
    topProduct: string;
    topProductRevenue: number;
    bestWeek: string;
    netProfitEstimate: number;
  };
  predictive: {
    totalMonthlyForecastUnits: number;
    bestModelCounts: Partial<Record<ForecastModelName, number>>;
    averageMape: number;
  };
  prescriptive: {
    optimalProfit: number;
    baselineProfit: number;
    improvementPercent: number;
    bindingResources: string[];
  };
}
