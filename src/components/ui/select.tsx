import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { fieldClassName } from "@/components/ui/input";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClassName, "cursor-pointer pr-9", className)} {...props}>
      {children}
    </select>
  );
}
