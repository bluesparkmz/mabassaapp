const NEGOTIABLE = /a\s*negociar/i;

/** Número → "50 000 MZN" */
export function formatMzn(amount, { prefix = "", suffix = " MZN" } = {}) {
  if (amount == null || amount === "") return null;
  const num = Number(amount);
  if (!Number.isFinite(num)) return null;
  return `${prefix}${num.toLocaleString("pt-MZ", { maximumFractionDigits: 0 })}${suffix}`;
}

export function formatSalaryRange(min, max) {
  if (min != null && max != null) {
    return `${Number(min).toLocaleString("pt-MZ")} - ${Number(max).toLocaleString("pt-MZ")} MZN`;
  }
  if (min != null) return `${Number(min).toLocaleString("pt-MZ")} MZN+`;
  if (max != null) return `Até ${Number(max).toLocaleString("pt-MZ")} MZN`;
  return "A negociar";
}

/** Texto da API ou mock → sempre MZN (nunca $ / USD) */
export function displayMoney(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") return formatMzn(value);

  let text = String(value).trim();
  if (!text || NEGOTIABLE.test(text)) return text;

  text = text
    .replace(/\$/g, "")
    .replace(/\bUSD\b/gi, "")
    .replace(/\bUS\$\b/gi, "")
    .replace(/\bKz\b/gi, "MZN")
    .replace(/\/\s*Month\b/gi, "/mês")
    .replace(/\/\s*month\b/gi, "/mês")
    .replace(/\s+/g, " ")
    .trim();

  if (!/\bMZN\b/i.test(text) && /\d/.test(text)) {
    text = `${text} MZN`;
  }

  return text;
}

export function salaryFromItem(item) {
  if (!item) return null;
  if (item.salary_min != null || item.salary_max != null) {
    return formatSalaryRange(item.salary_min, item.salary_max);
  }
  return displayMoney(item.salary);
}

export function priceFromItem(item) {
  if (!item) return null;
  if (typeof item.price === "number") {
    return formatMzn(item.price, { prefix: "Desde " });
  }
  return displayMoney(item.price);
}

export function normalizeFeedItem(item) {
  if (!item || typeof item !== "object") return item;
  const next = { ...item };
  if (item.type === "vaga") {
    next.salary = salaryFromItem(item) || displayMoney(item.salary);
  }
  if (item.type === "servico") {
    next.price = priceFromItem(item) || displayMoney(item.price);
  }
  return next;
}
