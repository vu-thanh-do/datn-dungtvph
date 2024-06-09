export interface IAnalytic {
  name: string
  value: number
}
export interface IAnalytics {
  vouchers: IAnalytic[]
  countOrderDay: IAnalytic[]
  countOrderStatus: IAnalytic[]
  moneys: IAnalytic[]
  users: IAnalytic[]
  products: IAnalytic[]
  categorys: IAnalytic[]
  blogs: IAnalytic[]
  categoryBlogs: IAnalytic[]
  moneyOrderStatus: IAnalytic[]
}

// Định nghĩa kiểu cho mỗi mục trong "số đơn" của "doanh thu tháng này"
export interface OrderInfo {
  count: number
  money: number
}

// Định nghĩa kiểu cho "doanh thu tháng này"
export interface MonthlyRevenue {
  'tháng này': number
  'tổng doanh thu': number
  'số đơn': {
    'tháng 11': OrderInfo
    'tháng 1': OrderInfo
    'tháng 2': OrderInfo
    'tháng 3': OrderInfo
    'tháng 4': OrderInfo
    'tháng 5': OrderInfo
    'tháng 6': OrderInfo
    'tháng 7': OrderInfo
    'tháng 8': OrderInfo
    'tháng 9': OrderInfo
    'tháng 10': OrderInfo
    'tháng 12': OrderInfo
  }
  // 'số đơn đã hoàn thành': {
  //   'tháng 11': OrderInfo
  // }
  'doanh thu khách vãn lai ': number
}

// Định nghĩa kiểu cho "mặt hàng bán chạy tháng này"
export interface BestSellingProduct {
  count: number
  name: string
}

// Định nghĩa kiểu cho danh sách mặt hàng bán chạy
export interface BestSellingProductsList {
  [productName: string]: number
}

// Định nghĩa kiểu cho "user mua 2 đơn trở lên"
export type UserWithMultipleOrders = any[] // Thay "any" bằng kiểu chính xác nếu có thể

// Định nghĩa kiểu cho dữ liệu chính
export interface DataAnalytics {
  '*theo thời gian tuỳ ý': any[] // Thay "any" bằng kiểu chính xác nếu có thể
  voucher: {
    'số lượng': number
    'tổng tiền': number
  }
  'doanh thu tháng này': MonthlyRevenue
  'số user tham gia': {
    'tháng này': number
    'tổng ': number
    'khách vãn lai': number
  }
  'mặt hàng bán chạy tháng này': {
    'sản phẩm bán nhiều nhất': BestSellingProduct
    'danh sách ': BestSellingProductsList
  }
  'user mua 2 đơn trở lên': UserWithMultipleOrders
  TopSell: TopSell
}

export interface IProductAnalytic {
  count: number
  _id: string
  images: string[]
  price: number
  name: string
}

export interface TopSell {
  'sản phẩm bán nhiều nhất': IProductAnalytic
  List: { [key: string]: IProductAnalytic }
}

// order status
export type orderStatus = 'pending' | 'confirmed' | 'done' | 'canceled'
export type orderRevenue = 'weeks' | 'months' | 'years'

export interface IAnalticRevenueWeek {
  week: number
  totalRevenue: number
}

export interface IAnalticRevenueMonth {
  month: number
  totalRevenue: number
}

export interface IAnalticRevenueStatus {
  name: orderStatus
  analytics: IAnalticRevenueWeek[] | IAnalticRevenueMonth[]
}

export interface IAnalyticMonths {
  orders: {
    name: orderRevenue
    analytics: IAnalticRevenueStatus[]
  }[]
}
