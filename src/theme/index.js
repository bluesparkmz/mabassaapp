/** Design tokens — paleta única verde (primary) + neutros */
export const colors = {
  primary: "#16A34A",
  primaryDark: "#15803D",
  primaryLight: "#DCFCE7",
  primaryMuted: "#BBF7D0",
  /** Tags e badges — sempre derivados do primary */
  tagBg: "#DCFCE7",
  tagText: "#15803D",
  tagBgSoft: "#ECFDF5",
  tagTextSoft: "#16A34A",
  black: "#111111",
  text: "#111111",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  searchBg: "#F3F4F6",
  tagGray: "#F3F4F6",
  tagGrayText: "#4B5563",
  danger: "#EF4444",
  white: "#FFFFFF",
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
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

export function jobTypeTagStyle() {
  return tagStyle();
}

export function contentTypeTagStyle() {
  return tagStyle();
}
