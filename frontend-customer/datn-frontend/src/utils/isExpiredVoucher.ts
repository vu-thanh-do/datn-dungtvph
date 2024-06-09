const isExpiredVoucher = (endDateString: string) => {
  const now = new Date().getTime()
  const endDate = new Date(endDateString).getTime()
  return now >= endDate ? true : false
}

export default isExpiredVoucher
