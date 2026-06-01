export * from "./palette";

import { ACCENT_DARK, ACCENT_LIGHT, cardShadow, colors as paletteColors } from "./palette";

/** Tokens da nova UI (radius, sombras, pills) */
export const colors = {
  ...paletteColors,
  borderLight: "#F3F4F6",
  tagBg: ACCENT_LIGHT,
  tagText: ACCENT_DARK,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 9999,
};

export const shadow = {
  card: cardShadow,
  soft: cardShadow,
};

export const cardStyle = {
  backgroundColor: colors.surface,
  borderRadius: radius.lg,
  padding: 18,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: colors.borderLight,
  ...shadow.card,
};

/** Pills de tipo (vaga, serviço, empresa, job type) — só verde */
export function tagStyle() {
  return { bg: colors.tagBg, text: colors.tagText };
}

export function contentTypeTagStyle() {
  return tagStyle();
}

export function jobTypeTagStyle() {
  return tagStyle();
}
