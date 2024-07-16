export const renderOrderStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Đang chờ xử lý'
    case 'confirmed':
      return 'Đã xác nhận'
    case 'shipping':
      return 'Đang giao hàng'
    case 'delivered':
      return 'Đã giao hàng'
    case 'done':
      return 'Đã hoàn thành'
    case 'canceled':
      return 'Đã hủy'
    default:
      return 'Không xác định'
  }
}
