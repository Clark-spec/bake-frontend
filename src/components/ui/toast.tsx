import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ComponentType, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import {
  IconAlert,
  IconCheck,
  IconClose,
  IconInfo,
  type IconProps,
} from "@/components/ui/icons";

type ToastTone = "success" | "error" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
}

type PushToast = (options: ToastOptions) => void;

interface ToastItem extends ToastOptions {
  id: number;
  tone: ToastTone;
  leaving: boolean;
}

const ToastContext = createContext<PushToast | null>(null);

// eslint-disable-next-line react-refresh/only-export-components -- the hook shares the toast context with the provider
export function useToast(): PushToast {
  const push = useContext(ToastContext);
  if (!push) throw new Error("useToast must be called inside <ToastProvider>.");
  return push;
}

const TONES: Record<
  ToastTone,
  { icon: ComponentType<IconProps>; chip: string; bar: string }
> = {
  success: {
    icon: IconCheck,
    chip: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    bar: "from-emerald-400 via-teal-400 to-emerald-500",
  },
  error: {
    icon: IconAlert,
    chip: "border-rose-500/20 bg-rose-500/10 text-rose-700",
    bar: "from-rose-400 via-red-400 to-rose-500",
  },
  info: {
    icon: IconInfo,
    chip: "border-amber-500/25 bg-amber-500/15 text-amber-700",
    bar: "from-amber-400 via-orange-400 to-amber-500",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    const existing = timers.current.get(id);
    if (existing) {
      window.clearTimeout(existing);
      timers.current.delete(id);
    }
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, leaving: true } : item)),
    );
    const timer = window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
      timers.current.delete(id);
    }, 220);
    timers.current.set(id, timer);
  }, []);

  const push = useCallback(
    (options: ToastOptions) => {
      const id = ++idRef.current;
      setItems((current) => [
        ...current.slice(-2),
        {
          id,
          title: options.title,
          description: options.description,
          tone: options.tone ?? "success",
          leaving: false,
        },
      ]);
      const timer = window.setTimeout(() => dismiss(id), 4600);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="false"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex flex-col items-end gap-3 p-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:p-0"
        >
          {items.map((item) => {
            const tone = TONES[item.tone];
            const ToneIcon = tone.icon;
            return (
              <div
                key={item.id}
                role="status"
                className={cn(
                  "glass-strong pointer-events-auto relative w-full overflow-hidden rounded-2xl p-4 pr-10 sm:w-[22rem]",
                  item.leaving ? "animate-toast-out" : "animate-toast-in",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
                      tone.chip,
                    )}
                  >
                    <ToneIcon className="h-[1.1rem] w-[1.1rem]" />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-stone-900">{item.title}</p>
                    {item.description && (
                      <p className="mt-0.5 text-sm leading-snug text-stone-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label="Dismiss notification"
                  className="absolute right-2.5 top-2.5 grid h-7 w-7 cursor-pointer place-items-center rounded-full text-stone-400 transition-colors hover:bg-stone-900/5 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
                >
                  <IconClose className="h-3.5 w-3.5" />
                </button>
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r",
                    tone.bar,
                  )}
                />
              </div>
            );
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
