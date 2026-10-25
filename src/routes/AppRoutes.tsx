import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import MainLayout from "@/layouts/MainLayout";

const OverviewPage = lazy(() => import("@/pages/overview"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const DescriptivePage = lazy(() => import("@/pages/descriptive"));
const PredictivePage = lazy(() => import("@/pages/predictive"));
const PrescriptivePage = lazy(() => import("@/pages/prescriptive"));
const DataPage = lazy(() => import("@/pages/data"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="descriptive" element={<DescriptivePage />} />
        <Route path="predictive" element={<PredictivePage />} />
        <Route path="prescriptive" element={<PrescriptivePage />} />
        <Route path="data" element={<DataPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
