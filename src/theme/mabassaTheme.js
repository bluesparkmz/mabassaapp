/** Re-export da paleta verde (legado — preferir @/theme) */
import {
  ACCENT,
  ACCENT_LIGHT,
  ACCENT_DARK,
  ACCENT_SOFT,
  TEXT_MAIN,
  TEXT_SUB,
  TEXT_MUTED,
  BG_SOFT,
  CARD,
  BORDER,
  BLACK,
  jobTypeBadgeStyle,
  getGreeting,
} from "./palette";

export const colors = {
  primary: ACCENT,
  primaryLight: ACCENT_LIGHT,
  primarySoft: ACCENT_SOFT,
  primaryDark: ACCENT_DARK,
  text: TEXT_MAIN,
  textSecondary: TEXT_SUB,
  textMuted: TEXT_MUTED,
  bg: BG_SOFT,
  card: CARD,
  border: BORDER,
  black: BLACK,
};

export { cardShadow as shadowSoft } from "./palette";

export const cardStyle = {
  backgroundColor: CARD,
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: BORDER,
};

export function jobTypeColors() {
  const { bg, color } = jobTypeBadgeStyle();
  return { bg, color };
}

export { getGreeting as getTimeGreeting };

export function firstName(fullName) {
  if (!fullName || typeof fullName !== "string") return "visitante";
  return fullName.trim().split(/\s+/)[0];
}
