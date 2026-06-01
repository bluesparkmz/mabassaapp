/** Design tokens — estilo clean (referência job list + freelancer home) */
export const ACCENT = "#16A34A";
export const ACCENT_LIGHT = "#DCFCE7";
export const ACCENT_DARK = "#15803D";
export const TEXT_MAIN = "#111827";
export const TEXT_SUB = "#6B7280";
export const TEXT_MUTED = "#9CA3AF";
export const BG = "#FFFFFF";
export const BG_SOFT = "#F9FAFB";
export const CARD = "#FFFFFF";
export const BORDER = "#E5E7EB";
export const CHIP_ACTIVE = "#111827";
export const BLACK = "#111827";

export const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 2,
};

export const feedCardStyle = {
  backgroundColor: CARD,
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: BORDER,
  ...cardShadow,
};

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function jobTypeBadgeStyle(jobType = "") {
  const t = jobType.toLowerCase();
  if (t.includes("freelance") || t.includes("freelancer")) {
    return { bg: "#DCFCE7", color: "#15803D" };
  }
  if (t.includes("part")) {
    return { bg: "#FFEDD5", color: "#C2410C" };
  }
  if (t.includes("full") || t.includes("tempo inteiro")) {
    return { bg: "#DBEAFE", color: "#1D4ED8" };
  }
  return { bg: "#F3F4F6", color: "#4B5563" };
}
