import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function RecordForm({
  title,
  onSubmit,
  submitting,
  error,
  children,
}: {
  title: string;
  onSubmit: () => void;
  submitting: boolean;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="glass rounded-3xl p-5 sm:p-6"
    >
      <h3 className="mb-3 text-[0.95rem] font-semibold text-stone-800">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      <div className="mt-4">
        <Button type="submit" loading={submitting}>
          {submitting ? "Saving…" : "Add record"}
        </Button>
      </div>
    </form>
  );
}
