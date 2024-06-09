export const formatCurrency = (price) => {
  const formatCurrency = price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  return formatCurrency;
};
