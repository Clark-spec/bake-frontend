import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { IconAlert, IconCheck, IconClose } from "@/components/ui/icons";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [leaving, setLeaving] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<number | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const requestClose = useCallback(
    (after: () => void) => {
      if (loading) return;
      setLeaving(true);
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => {
        after();
        setLeaving(false);
      }, 180);
    },
    [loading],
  );

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose(onCancel);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onCancel, requestClose]);

  useEffect(
    () => () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  if (!open) return null;

  const danger = tone === "danger";
  const resolvedConfirmLabel = confirmLabel ?? (danger ? "Delete" : "Confirm");

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <div
        className={cn(
          "absolute inset-0 bg-stone-950/45 backdrop-blur-[6px]",
          leaving ? "animate-backdrop-out" : "animate-backdrop-in",
        )}
        onClick={() => requestClose(onCancel)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "glass-strong relative w-full max-w-md rounded-[1.75rem] p-6 sm:p-7",
          leaving ? "animate-modal-out" : "animate-modal-in",
        )}
      >
        <button
          type="button"
          onClick={() => requestClose(onCancel)}
          disabled={loading}
          aria-label="Close dialog"
          className="absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-stone-400 transition-colors hover:bg-stone-900/5 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconClose className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <span
            className={cn(
              "grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg",
              danger
                ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/25"
                : "bg-gradient-to-br from-amber-400 to-orange-600 shadow-amber-500/25",
            )}
          >
            {danger ? <IconAlert className="h-6 w-6" /> : <IconCheck className="h-6 w-6" />}
          </span>
          <div className="min-w-0 pr-6">
            <h2 id={titleId} className="font-display text-xl font-semibold tracking-tight text-stone-900">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="mt-2 text-sm leading-relaxed text-stone-600">
                {description}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => requestClose(onCancel)} disabled={loading} autoFocus>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "solidDanger" : "primary"} onClick={onConfirm} loading={loading}>
            {resolvedConfirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
