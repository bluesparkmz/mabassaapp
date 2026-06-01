/** Design tokens — estilo marketplace / job list (verde + cards limpos) */
export const colors = {
  primary: "#16A34A",
  primaryLight: "#22C55E",
  primarySoft: "#DCFCE7",
  primaryBanner: "#ECFDF5",
  accentBlue: "#2563EB",
  accentBlueSoft: "#DBEAFE",
  text: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  bg: "#F9FAFB",
  card: "#FFFFFF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  danger: "#EF4444",
  black: "#111111",
};

export const cardStyle = {
  backgroundColor: colors.card,
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: colors.border,
};

export const shadowSoft = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 2,
};

export function jobTypeColors(jobType = "") {
  const t = jobType.toLowerCase();
  if (t.includes("freel") || t.includes("remot")) {
    return { bg: colors.primarySoft, color: colors.primary };
  }
  if (t.includes("part")) {
    return { bg: "#FEF3C7", color: "#D97706" };
  }
  return { bg: colors.accentBlueSoft, color: colors.accentBlue };
}

export function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function firstName(fullName) {
  if (!fullName || typeof fullName !== "string") return "visitante";
  return fullName.trim().split(/\s+/)[0];
}
