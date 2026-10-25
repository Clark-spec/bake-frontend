import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

export type IconProps = SVGProps<SVGSVGElement>;

function Icon({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 10.6 12 3.6l8.5 7" />
      <path d="M5.6 9.4V20a1 1 0 0 0 1 1h10.8a1 1 0 0 0 1-1V9.4" />
      <path d="M9.6 21v-5.6h4.8V21" />
    </Icon>
  );
}

export function IconChartBars(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20h16" />
      <path d="M7.5 20v-6.5" />
      <path d="M12 20V8.5" />
      <path d="M16.5 20v-9.5" />
      <path d="M4.5 8.5 9 4.5l3 2.5 6.5-5" opacity="0.55" />
    </Icon>
  );
}

export function IconTrendingUp(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m3.5 16.5 5.6-5.6 3.9 3.9 7.5-7.5" />
      <path d="M15 7.3h5.5v5.5" />
    </Icon>
  );
}

export function IconSparkles(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.2 13.8 8l4.8 1.8-4.8 1.8L12 16.4l-1.8-4.8L5.4 9.8 10.2 8 12 3.2Z" />
      <path d="M18.8 15.4l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3Z" />
      <path d="M5 15.5l.7 1.8 1.8.7-1.8.7L5 20.5l-.7-1.8L2.5 18l1.8-.7L5 15.5Z" opacity="0.7" />
    </Icon>
  );
}

export function IconSliders(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6h11" />
      <path d="M18.5 6H21" />
      <path d="M3 12h5.5" />
      <path d="M13 12h8" />
      <path d="M3 18h9.5" />
      <path d="M17 18h4" />
      <circle cx="16.2" cy="6" r="2.1" />
      <circle cx="10.6" cy="12" r="2.1" />
      <circle cx="14.6" cy="18" r="2.1" />
    </Icon>
  );
}

export function IconDatabase(props: IconProps) {
  return (
    <Icon {...props}>
      <ellipse cx="12" cy="5.6" rx="7.5" ry="3" />
      <path d="M4.5 5.6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
      <path d="M4.5 11.6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
    </Icon>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </Icon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </Icon>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10.3 4.1 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.1a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4.2" />
      <path d="M12 16.8h.01" />
    </Icon>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6.5h16" />
      <path d="M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
      <path d="m6.3 6.5.8 12.2a1.8 1.8 0 0 0 1.8 1.8h6.2a1.8 1.8 0 0 0 1.8-1.8l.8-12.2" />
      <path d="M10.2 10.5v6" />
      <path d="M13.8 10.5v6" />
    </Icon>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </Icon>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m14.5 6-6 6 6 6" />
    </Icon>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9.5 6 6 6-6 6" />
    </Icon>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.2 12a8.2 8.2 0 1 1-2.4-5.8" />
      <path d="M20.4 4.2v5.2h-5.2" />
    </Icon>
  );
}

export function IconSave(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M7 3v5.5h8V3" />
      <path d="M7 16.5h10V21H7z" />
    </Icon>
  );
}

export function IconWheat(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21.5V9" />
      <path d="M12 9c-.3-2.4.7-4.2 3.2-5.3.4 2.7-.7 4.5-3.2 5.3Z" />
      <path d="M12 9c.3-2.4-.7-4.2-3.2-5.3-.4 2.7.7 4.5 3.2 5.3Z" />
      <path d="M12 14c-.3-2.4.7-4.2 3.2-5.3.4 2.7-.7 4.5-3.2 5.3Z" />
      <path d="M12 14c.3-2.4-.7-4.2-3.2-5.3-.4 2.7.7 4.5 3.2 5.3Z" />
      <path d="M12 19c-.3-2.4.7-4.2 3.2-5.3.4 2.7-.7 4.5-3.2 5.3Z" />
      <path d="M12 19c.3-2.4-.7-4.2-3.2-5.3-.4 2.7.7 4.5 3.2 5.3Z" />
    </Icon>
  );
}

export function IconCoins(props: IconProps) {
  return (
    <Icon {...props}>
      <ellipse cx="9" cy="6.5" rx="5.5" ry="2.5" />
      <path d="M3.5 6.5v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4" />
      <path d="M3.5 10.5v4c0 1.4 2.5 2.5 5.5 2.5 1.5 0 2.9-.3 3.9-.8" />
      <path d="M13.5 15.5c0 1.4 2.3 2.5 5 2.5s5-1.1 5-2.5v-3c0-1.2-1.7-2.2-4-2.5" />
      <path d="M13.5 12.5c0 1.4 2.3 2.5 5 2.5s5-1.1 5-2.5" />
    </Icon>
  );
}

export function IconBox(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4.3 7.7 7.7 4.4 7.7-4.4" />
      <path d="M12 12.1V21" />
      <path d="m8 5.2 8 4.5" opacity="0.55" />
    </Icon>
  );
}

export function IconReceipt(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-2.6-1.6L13.8 21l-2.4-1.6L9 21l-2.4-1.6L4 21V4.5a1 1 0 0 1 1-1Z" />
      <path d="M8.5 8h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 16h4" />
    </Icon>
  );
}

export function IconWallet(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 8.5V7a2 2 0 0 0-2-2H5.5A2.5 2.5 0 0 0 3 7.5V18a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-2" />
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18" />
      <path d="M15 11h6v5h-6a2.5 2.5 0 0 1 0-5Z" />
      <path d="M17.5 13.5h.01" />
    </Icon>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.2" />
      <path d="M12 7.8h.01" />
    </Icon>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15.5 19.5v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1.6" />
      <circle cx="8.8" cy="7.6" r="3.2" />
      <path d="M22 19.5v-1.6a4 4 0 0 0-3-3.87" />
      <path d="M16 4.5a3.2 3.2 0 0 1 0 6.2" />
    </Icon>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </Icon>
  );
}