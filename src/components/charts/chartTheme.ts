import type { CSSProperties } from "react";

export const AXIS_TICK = { fill: "#78716c", fontSize: 12 };

export const GRID_STROKE = "rgba(120, 113, 108, 0.16)";

export const TOOLTIP_STYLE: CSSProperties = {
  borderRadius: 14,
  border: "1px solid rgba(255, 255, 255, 0.85)",
  background: "rgba(255, 252, 247, 0.94)",
  boxShadow: "0 20px 44px -24px rgba(68, 45, 20, 0.55)",
  backdropFilter: "blur(14px)",
  padding: "10px 12px",
  fontSize: 13,
};

export const TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: "#78716c",
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 4,
};

export const TOOLTIP_ITEM_STYLE: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
};

export const LEGEND_STYLE: CSSProperties = {
  fontSize: 12,
  color: "#78716c",
  paddingTop: 10,
};
