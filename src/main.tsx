import "@/styles/global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppRoutes from "@/routes/AppRoutes";
import { ToastProvider } from "@/components/ui/toast";

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ToastProvider>,
);
