export const formatCurrency = (price: number) => {
  const formatCurrency = price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  return formatCurrency
}

export const formatPriceCompact = (price: number) => {
  let Compact = price?.toLocaleString('vi-VN', { currency: 'VND' })

  Compact =
    Compact.split('.').length === 1
      ? formatCurrency(Number(Compact.split('.')[0]))
      : Compact.split('.').length === 2
      ? `${Compact.split('.')[0]}K`
      : `${Compact.split('.')[0]}Tr`
  return Compact
}

export const formatNumberDigits = (number: number) => {
  return Number(new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 10 }).format(number))
}

export const formattedAmount = (amount: number) => {
  const formatter = '$' + (amount / 1000).toFixed(3) + 'K'
  return formatter
}
