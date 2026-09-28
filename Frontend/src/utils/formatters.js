/**
 * Currency formatter: formats a number as USD currency ($10,000.00)
 */
export const formatCurrency = (amount, decimals = 2) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * PnL formatter: formats with + or - sign and currency
 */
export const formatPnL = (amount, decimals = 2) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0.00';
  }
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';
  const absFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(amount));
  
  return `${sign}${absFormatted}`;
};

/**
 * Percentage formatter (e.g., 8% or 31.5%)
 */
export const formatPercent = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) {
    return '0%';
  }
  return `${Number(val).toFixed(decimals)}%`;
};

/**
 * Number formatter with commas
 */
export const formatNumber = (num, decimals = 2) => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Date formatter for trade dates (e.g. "Aug 26, 2026")
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options,
    }).format(date);
  } catch {
    return '—';
  }
};

/**
 * DateTime formatter (e.g. "Aug 26, 2026 14:32")
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return '—';
  }
};
