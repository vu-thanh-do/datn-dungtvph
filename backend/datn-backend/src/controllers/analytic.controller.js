import Coins from '../models/coin.js';
import Category from '../models/category.model.js';
import { CategoryBlog } from '../models/category-blog.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import Voucher from '../models/voucher.model.js';
import newBlogModel from '../models/newsBlogs.model.js';

export const analyticController = {
  /* số lượng order 1 ngày */
  countOrder: async (req, res) => {
    try {
      const countOrders = await Order.countDocuments(); /* lấy hết order đang có */
      const countOrderActive = await Order.countDocuments({ isActive: true });
      const countOrderInActive = await Order.countDocuments({ isActive: false });
      const countOrderExpiration = await Order.countDocuments({
        isActive: true,
        endDate: { $gte: new Date() }, // Chỉ lấy các order chưa hết hạn
      });
      const countOrderNotExpiration = await Order.countDocuments({
        isActive: true,
        endDate: { $lt: new Date() }, // Chỉ lấy các order đã hết hạn
      });
      /* order có trạng thái là pending */
      const countOrderPending = await Order.countDocuments({ status: 'pending' });
      /* order có trạng thái là confirmed */
      const countOrderConfirmed = await Order.countDocuments({ status: 'confirmed' });
      /* order có trạng thái là delivered */
      const countOrderDelivered = await Order.countDocuments({ status: 'delivered' });
      /* order có trạng thái là done */
      const countOrderDone = await Order.countDocuments({ status: 'done' });
      /* order có trạng thái là canceled */
      const countOrderCanceled = await Order.countDocuments({ status: 'canceled' });
      /* order có trạng thái là pending và đã hết hạn */
      const countOrderPendingExpiration = await Order.countDocuments({
        status: 'pending',
        endDate: { $gte: new Date() }, // Chỉ lấy các order chưa hết hạn
      });
      return res.status(200).json({
        countOrders,
        countOrderActive,
        countOrderInActive,
        countOrderExpiration,
        countOrderNotExpiration,
        countOrderPending,
        countOrderConfirmed,
        countOrderDelivered,
        countOrderDone,
        countOrderCanceled,
        countOrderPendingExpiration,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* số lượng order 1 tuần */
  countOrderWeek: async (req, res) => {
    try {
      // const countOrderWeek = await Order.countDocuments({
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là pending */
      // const countOrderPending = await Order.countDocuments({
      //   status: 'pending',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là confirmed */
      // const countOrderConfirmed = await Order.countDocuments({
      //   status: 'confirmed',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là delivered */
      // const countOrderDelivered = await Order.countDocuments({
      //   status: 'delivered',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là done */
      // const countOrderDone = await Order.countDocuments({
      //   status: 'done',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là canceled */
      // const countOrderCanceled = await Order.countDocuments({
      //   status: 'canceled',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // return res.status(200).json({
      //   countOrderWeek,
      //   countOrderPending,
      //   countOrderConfirmed,
      //   countOrderDelivered,
      //   countOrderDone,
      //   countOrderCanceled,
      // });
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const counts = await Order.aggregate([
        { $match: { createdAt: { $gte: oneWeekAgo } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      const countOrderWeek = {
        total: 0,
        pending: 0,
        confirmed: 0,
        delivered: 0,
        done: 0,
        canceled: 0,
      };
      counts.forEach((item) => {
        countOrderWeek.total += item.count;
        if (item._id) {
          countOrderWeek[item._id] = item.count;
        }
      });
      return res.status(200).json(countOrderWeek);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* số lượng order 1 tháng */
  /* số lượng order 1 năm */
  /* số lượng order 1 quý */
  /* số lượng order 1 ngày theo từng sản phẩm */
  // countOrderDayByCategory: async (req, res) => {
  //   try {
  //     const oneDayAgo = new Date();
  //     oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  //     const counts = await Order.aggregate([
  //       { $match: { createdAt: { $gte: oneDayAgo } } },
  //       { $unwind: '$items' },
  //       { $group: { _id: '$items.product.category', count: { $sum: '$items.quantity' } } },
  //     ]);
  //     const countOrderDayByCategory = {};
  //     counts.forEach((item) => {
  //       countOrderDayByCategory[item._id] = item.count;
  //     });
  //     return res.status(200).json(countOrderDayByCategory);
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // },
  countOrderDayByProduct: async (req, res) => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const counts = await Order.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
      ]);
      const countOrderDayByProduct = {};
      counts.forEach((item) => {
        countOrderDayByProduct[item._id] = item.count;
      });
      return res.status(200).json(countOrderDayByProduct);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* số lượng order 1 tuần theo từng sản phẩm */
  // countOrderWeekByCategory: async (req, res) => {}
  /* số lượng order 1 tháng theo từng trạng thái */
  /* thống kế về doanh thu */
  analyticPrice: async (req, res) => {
    try {
      const analyticPrices = await Order.find({ status: 'done' }).select('total');
      const analyticPrice = analyticPrices.reduce((a, b) => a + b.total, 0);
      return res.status(200).json({ analyticPrice });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* thống kê về số lượng sản phẩm đã bán */
  /* thống kê về số lượng sản phẩm đã bán theo tháng */
  /* thống kê về số lượng sản phẩm đã bán theo năm */
  /* thống kê về số lượng sản phẩm đã bán theo ngày */
  /* thống kê về số lượng sản phẩm đã bán theo tuần */
  /* thống kê về số lượng sản phẩm đã bán theo quý */
  /* số lượng người dùng */
  countUser: async (req, res) => {
    try {
      const countUsers = await User.countDocuments(); /* lấy hết user đang có */
      // const countUserActive = await User.countDocuments({ isActive: true });
      // const countUserInActive = await User.countDocuments({ isActive: false });
      return res.status(200).json({
        countUsers,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* số lượng người dùng đang hoạt động */
  // countUserIsActive: async (req, res) => {
  //   try {
  //     const countUserIsActive = await User.countDocuments({ is: true });
  //     return res.status(200).json({ countUserIsActive });
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // },
  /* số lượng người dùng đã bị khóa */
  /* số lượng người dùng đã bị ẩn */
  /* số lượng người dùng đã bị xóa */
  /* số lượng người dùng đã đăng ký */
  /* thống kê sản phẩm đang hoạt động */
  /* thống kê sản phẩm đã bị xóa */
  /* thống kê sản phẩm đã bị ẩn */
  /* tổng số tiền thu được trong ngày này */
  totalMoneys: async (_, res) => {
    try {
      /* get total day */
      const totalMoneyDays = await Order.find({
        status: 'done',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        },
      }).select('total');
      /* số tiền thu được trong tuần */
      const totalMoneyWeeks = await Order.find({
        status: 'done',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7),
        },
      }).select('total');
      /* get total month */
      const totalMoneyMonths = await Order.find({
        status: 'done',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }).select('total');
      const totalMoneyDay = totalMoneyDays.reduce((a, b) => a + b.total, 0);
      const totalMoneyWeek = totalMoneyWeeks.reduce((a, b) => a + b.total, 0);
      const totalMoneyMonth = totalMoneyMonths.reduce((a, b) => a + b.total, 0);

      /* số lượng order 1 tuần */

      return res.status(200).json({ totalMoneyDay, totalMoneyWeek, totalMoneyMonth });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /* tổng số tiền thu theo từng ngày */
  totalMoneyDay: async (req, res) => {
    try {
      const thongKe = await Order.aggregate([
        { $match: { status: 'done' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            total: { $sum: '$total' },
          },
        },
      ])
        .sort({ _id: -1 })
        .limit(7);
      const totalMoneyDay = {};
      thongKe.forEach((item) => {
        totalMoneyDay[item._id] = item.total;
      });
      return res.status(200).json(totalMoneyDay);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // date -> y/m/d
  fillterOrderByCalendar: async (status, date) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    const isDate = `${year}-${month}-${day}`;
    const fillterDate = date ? new Date(date) : new Date(isDate);
    const thongKe = await Order.aggregate([
      { $match: { status: status, createdAt: { $lte: fillterDate } } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
    ])
      .sort({ _id: -1 })
      .limit(7);
    return thongKe;
  },

  /* tổng số tiền doanh thu theo tuần 52 tuần */
  getWeeklyRevenueByStatus: async (status) => {
    try {
      const currentYear = new Date().getFullYear();
      let weeklyRevenue = [];

      // Lặp qua 52 tuần trong năm
      for (let week = 1; week <= 52; week++) {
        // Xác định ngày đầu tiên và cuối cùng của tuần
        const startOfWeek = new Date(currentYear, 0, (week - 1) * 7);
        const endOfWeek = new Date(currentYear, 0, week * 7);

        const ordersInWeek = await Order.find({
          status,
          createdAt: { $gte: startOfWeek, $lte: endOfWeek },
        });

        const totalRevenueInWeek = ordersInWeek.reduce((total, order) => total + order.total, 0);

        weeklyRevenue.push({
          week: week,
          totalRevenue: totalRevenueInWeek,
        });
      }

      return weeklyRevenue;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getWeeklyRevenueByStatusAndCurrentMonth: async (status) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // Lấy tháng hiện tại (bắt đầu từ 0)

    // Xác định ngày đầu tiên và cuối cùng của tháng hiện tại
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Lấy số tuần trong tháng
    const totalWeeks = Math.ceil((lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + 1) / 7);


    let weeklyRevenue = [];

    // Lặp qua các tuần trong tháng
    for (let week = 1; week < totalWeeks; week++) {
      // Xác định ngày đầu tiên và cuối cùng của tuần
      const startOfWeek = new Date(currentYear, currentMonth, (week - 1) * 7 + 1);
      const endOfWeek = new Date(currentYear, currentMonth, week * 7);

      // Đảm bảo rằng endOfWeek không vượt quá ngày cuối cùng của tháng
      if (endOfWeek > lastDayOfMonth) {
        endOfWeek.setDate(lastDayOfMonth.getDate());
      }

      const ordersInWeek = await Order.find({
        status,
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
      });

      const totalRevenueInWeek = ordersInWeek.reduce((total, order) => total + order.total, 0);

      weeklyRevenue.push({
        week: week,
        totalRevenue: totalRevenueInWeek,
      });
    }

    return weeklyRevenue;
  },

  /* tổng số tiền thu theo từng tháng */
  countOrderByStatusAndMonth: async (status) => {
    const currentYear = new Date().getFullYear();
    let monthlyRevenue = [];

    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);

      const ordersInMonth = await Order.find({
        status,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });

      const totalRevenueInMonth = ordersInMonth.reduce((total, order) => total + order.total, 0);

      monthlyRevenue.push({
        month: month,
        totalRevenue: totalRevenueInMonth,
      });
    }

    return monthlyRevenue;
  },

  analytics: async (_, res) => {
    try {
      /* đếm số lượng khách hàng */
      const countUsers = await User.countDocuments(); /* lấy hết user đang có */
      const countUserActive = await User.countDocuments({ status: 'active' });
      const countUserInActive = await User.countDocuments({ status: 'inActive' });

      /* đếm số lượng sản phẩm */
      const countProducts = await Product.countDocuments(); /* lấy hết product đang có */
      const countProductActive = await Product.countDocuments({ is_active: true });
      const countProductInActive = await Product.countDocuments({ is_active: false });
      const countProductDeleted = await Product.countDocuments({ is_deleted: true });
      const countProductNotDeleted = await Product.countDocuments({ is_deleted: false });

      /* đếm số lượng voucher hiện có */
      const countVouchers = await Voucher.countDocuments(); /* lấy hết voucher đang có */
      const countVoucherActive = await Voucher.countDocuments({ isActive: true });
      const countVoucherInActive = await Voucher.countDocuments({ isActive: false });
      const countVoucherExpiration = await Voucher.countDocuments({
        isActive: true,
        endDate: { $gte: new Date() }, // Chỉ lấy các voucher chưa hết hạn
      });
      const countVoucherNotExpiration = await Voucher.countDocuments({
        isActive: true,
        endDate: { $lt: new Date() }, // Chỉ lấy các voucher đã hết hạn
      });

      /* category */
      const countCategorys = await Category.countDocuments(); /* lấy hết category đang có */
      const countCategoryActive = await Category.countDocuments({ is_deleted: true });
      const countCategoryInActive = await Category.countDocuments({ is_deleted: false });

      /* new blog */
      const categoryBlog = await CategoryBlog.countDocuments(); /* lấy hết blog đang có */
      const countCategoryBlogActive = await CategoryBlog.countDocuments({ is_active: true });
      const countCategoryBlogInActive = await CategoryBlog.countDocuments({ is_active: false });

      /* blog */
      const countBlogs = await newBlogModel.countDocuments(); /* lấy hết blog đang có */
      const countBlogActive = await newBlogModel.countDocuments({ is_active: true });
      const countBlogInActive = await newBlogModel.countDocuments({ is_active: false });

      /* get total day */
      const totalMoneyDays = await Order.find({
        status: 'done',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        },
      }).select('total');
      /* số tiền thu được trong tuần */
      const totalMoneyWeeks = await Order.find({
        status: 'done',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7),
        },
      }).select('total');
      /* get total month */
      const totalMoneyMonths = await Order.find({
        status: 'done',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }).select('total');
      const totalMoneyDay = totalMoneyDays.reduce((a, b) => a + b.total, 0);
      const totalMoneyWeek = totalMoneyWeeks.reduce((a, b) => a + b.total, 0);
      const totalMoneyMonth = totalMoneyMonths.reduce((a, b) => a + b.total, 0);

      /* số lượng order 1 ngayf */
      const countOrders = await Order.countDocuments(); /* lấy hết order đang có */
      const countOrderActive = await Order.countDocuments({ isActive: true });
      const countOrderInActive = await Order.countDocuments({ isActive: false });
      const countOrderExpiration = await Order.countDocuments({
        isActive: true,
        endDate: { $gte: new Date() }, // Chỉ lấy các order chưa hết hạn
      });
      const countOrderNotExpiration = await Order.countDocuments({
        isActive: true,
        endDate: { $lt: new Date() }, // Chỉ lấy các order đã hết hạn
      });
      /* order có trạng thái là pending */
      const countOrderPending = await Order.countDocuments({ status: 'pending' });
      /* số tiến có trạng thái là pending */
      const countOrderPendingMoneys = await Order.find({ status: 'pending' }).select('total');
      /* order có trạng thái là confirmed */
      const countOrderConfirmed = await Order.countDocuments({ status: 'confirmed' });
      /* số tiến có trạng thái là confirmed */
      const countOrderConfirmedMoneys = await Order.find({ status: 'confirmed' }).select('total');
      /* order có trạng thái là delivered */
      const countOrderDelivered = await Order.countDocuments({ status: 'delivered' });
      /* số tiến có trạng thái là done */
      const countOrderDeliveredMoneys = await Order.find({ status: 'done' }).select('total');
      /* order có trạng thái là done */
      const countOrderDone = await Order.countDocuments({ status: 'done' });
      /* order có trạng thái là canceled */
      const countOrderCanceled = await Order.countDocuments({ status: 'canceled' });
      /* tổng số tiền có trạng thái là cancalled */
      const countOrderCanceledMoneys = await Order.find({ status: 'canceled' }).select('total');
      /* order có trạng thái là pending và đã hết hạn */
      const countOrderPendingExpiration = await Order.countDocuments({
        status: 'pending',
        endDate: { $gte: new Date() }, // Chỉ lấy các order chưa hết hạn
      });

      return res.status(200).json({
        /* voucher */
        vouchers: [
          { name: 'total', value: countVouchers },
          { name: 'active', value: countVoucherActive },
          { name: 'inActive', value: countVoucherInActive },
          { name: 'expiration', value: countVoucherExpiration },
          { name: 'notExpiration', value: countVoucherNotExpiration },
        ],
        countOrderDay: [
          { name: 'total', value: countOrders },
          { name: 'active', value: countOrderActive },
          { name: 'inActive', value: countOrderInActive },
          { name: 'expiration', value: countOrderExpiration },
          { name: 'notExpiration', value: countOrderNotExpiration },
        ],
        countOrderStatus: [
          { name: 'pending', value: countOrderPending },
          { name: 'confirmed', value: countOrderConfirmed },
          // { name: 'delivered', value: countOrderDelivered },
          { name: 'done', value: countOrderDone },
          { name: 'canceled', value: countOrderCanceled },
          // { name: 'pendingExpiration', value: countOrderPendingExpiration },
        ],
        moneys: [
          {
            name: 'totalMoneyDay',
            value: totalMoneyDay,
          },
          {
            name: 'totalMoneyWeek',
            value: totalMoneyWeek,
          },
          {
            name: 'totalMoneyMonth',
            value: totalMoneyMonth,
          },
        ],

        /* money order status */
        moneyOrderStatus: [
          {
            name: 'pending',
            value: countOrderPendingMoneys.reduce((a, b) => a + b.total, 0),
          },
          {
            name: 'confirmed',
            value: countOrderConfirmedMoneys.reduce((a, b) => a + b.total, 0),
          },
          {
            name: 'done',
            value: countOrderDeliveredMoneys.reduce((a, b) => a + b.total, 0),
          },
          {
            name: 'canceled',
            value: countOrderCanceledMoneys.reduce((a, b) => a + b.total, 0),
          },
        ],

        /* users */
        users: [
          { name: 'total', value: countUsers },
          { name: 'active', value: countUserActive },
          { name: 'inActive', value: countUserInActive },
        ],

        /* products */
        products: [
          { name: 'total', value: countProducts },
          { name: 'active', value: countProductActive },
          { name: 'inActive', value: countProductInActive },
          { name: 'deleted', value: countProductDeleted },
          { name: 'notDeleted', value: countProductNotDeleted },
        ],

        /* category */
        categorys: [
          { name: 'total', value: countCategorys },
          { name: 'active', value: countCategoryActive },
          { name: 'inActive', value: countCategoryInActive },
        ],

        /* category blog */
        categoryBlogs: [
          { name: 'total', value: categoryBlog },
          { name: 'active', value: countCategoryBlogActive },
          { name: 'inActive', value: countCategoryBlogInActive },
        ],

        /* blog */
        blogs: [
          { name: 'total', value: countBlogs },
          { name: 'active', value: countBlogActive },
          { name: 'inActive', value: countBlogInActive },
        ],
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  analyticMonth: async (req, res) => {
    try {
      /* order có trạng thái là pending theo tháng */
      const countOrderPendingMonth = await analyticController.countOrderByStatusAndMonth('pending');
      /* order có trạng thái là confirmed theo tháng */
      const countOrderConfirmedMonth = await analyticController.countOrderByStatusAndMonth(
        'confirmed'
      );
      /* order có trạng thái là done theo tháng */
      const countOrderDoneMonth = await analyticController.countOrderByStatusAndMonth('done');
      /* order có trạng thái là canceled theo tháng */
      const countOrderCanceledMonth = await analyticController.countOrderByStatusAndMonth(
        'canceled'
      );

      /* số tiền thu được theo tuần */
      const totalMoneyWeeksPending =
        await analyticController.getWeeklyRevenueByStatusAndCurrentMonth('pending');
      const totalMoneyWeeksConfirmed =
        await analyticController.getWeeklyRevenueByStatusAndCurrentMonth('confirmed');
      const totalMoneyWeeksDone = await analyticController.getWeeklyRevenueByStatusAndCurrentMonth(
        'done'
      );
      const totalMoneyWeeksCanceled =
        await analyticController.getWeeklyRevenueByStatusAndCurrentMonth('canceled');

      /* số tiền thu được theo tháng */
      //   { $match: { status: 'done' } },
      //   {
      //     $group: {
      //       _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      //       total: { $sum: '$total' },
      //     },
      // ]).sort({ _id: -1 });

      return res.status(200).json({
        orders: [
          {
            name: 'weeks',
            analytics: [
              {
                name: 'pending',
                analytics: totalMoneyWeeksPending,
              },
              {
                name: 'confirmed',
                analytics: totalMoneyWeeksConfirmed,
              },
              {
                name: 'done',
                analytics: totalMoneyWeeksDone,
              },
              {
                name: 'canceled',
                analytics: totalMoneyWeeksCanceled,
              },
            ],
          },
          {
            name: 'months',
            analytics: [
              {
                pending: countOrderPendingMonth,
                confirmed: countOrderConfirmedMonth,
                done: countOrderDoneMonth,
                canceled: countOrderCanceledMonth,
              },
            ],
          },
        ],
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  analysticTotal: async (req, res) => {
    var doanh_thu = 0;
    const currentDate = new Date();

    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const result = await Order.find({
      $expr: {
        $and: [
          { $eq: [{ $year: '$createdAt' }, currentYear] },
          { $eq: [{ $month: '$createdAt' }, currentMonth] },
        ],
      },
    });
    const vvv = await Order.aggregate([
      {
        $project: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          total: '$total',
          status: '$status',
        },
      },
    ]);
    var list_doanhthu = {};
    for (const v of vvv) {
      if (v.status == 'canceled') continue;
      if (list_doanhthu['tháng ' + v.month] == undefined)
        list_doanhthu = {
          ...list_doanhthu,
          ...{ ['tháng ' + v.month]: { count: 1, money: v.total } },
        };
      else
        list_doanhthu['tháng ' + v.month] = {
          count: list_doanhthu['tháng ' + v.month].count + 1,
          money: list_doanhthu['tháng ' + v.month].money + v.total,
        };
    }
    var all_dth = 0;
    const all_dt = await Order.find({});
    for (const v of all_dt) if (v.status != 'canceled') all_dth += v.total;
    var sold_product = {};
    var m_product = { count: 0, name: '', _id: '', images: [] };
    //
    for (const v of result) {
      if (v.status != 'canceled') doanh_thu += v.total; //doanh thu
      for (const c of v.items) {
       
        if (!sold_product[c.name]) {
          sold_product[c.name] = { count: 1, _id: c._id, images: [c.image], price: c.price };
        } else {
          if (!sold_product[c.name].images.includes(c.image)) {
            sold_product[c.name].images.push(c.image);
          }
          sold_product[c.name].count++;
          sold_product[c.name]._id = c._id;
        }
        if (m_product.count < sold_product[c.name].count) {
          m_product.count = sold_product[c.name].count;
          m_product.name = c.name;
          m_product._id = c._id;
          m_product.images = sold_product[c.name].images;
        }
      }
    }

    //số user mới
    const nUs = await Coins.find({
      $expr: {
        $and: [
          { $eq: [{ $year: '$createdAt' }, currentYear] },
          { $eq: [{ $month: '$createdAt' }, currentMonth] },
        ],
      },
    });
    const all_nUs = await Coins.find({});
    //
    //vùng ngày
    const { fromDate, toDate, selectDate } = req.query;
    var AnaZone = [];
    if (fromDate && toDate) {
      var res1 = await Order.find({
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      });
      if (selectDate) res1 = await Order.find({ createdAt: new Date(selectDate) });
      //doanh thu tuần tự
      var dt_toDate = 0;
      var cancel_order_toDate = 0;
      var done_order_toDate = 0;
      var vnpay_toDate = 0;
      for (const value of res1) {
        dt_toDate += value.total; //dt
        if (value.status == 'canceled') cancel_order_toDate += 1;
        if (value.status == 'dont') done_order_toDate += 1;
        if (value.paymentMethodId == 'vnpay') vnpay_toDate += 1;
      }
      AnaZone = {
        'doanh thu vùng này': dt_toDate,
        'đơn hàng đã huỷ': cancel_order_toDate,
        'đơn hàng thành công': done_order_toDate,
        'trả tiền bằng vnpay': vnpay_toDate,
        'trả tiền bằng tiền mặt': res1.length - vnpay_toDate,
      };
    }
    //voucher
    const Vouchers = await Coins.find({});
    var total_voucher_money = 0;
    for (const v1 of Vouchers) total_voucher_money += v1.money;
    //user mua 2 đơn
    var userMap = {};
    var cUser2_Order = [];
    var c_ssUser2_Order = 0;
    var dt_ssUser2_Order = 0;
    for (const v of all_dt) {
      //lưu user mua  vào 1 map
      if (v.user == undefined) {
        dt_ssUser2_Order += v.total;
        c_ssUser2_Order++;
      } else if (userMap[v.user] == undefined && v.user != undefined)
        userMap = { ...userMap, ...{ [v.user]: 1 } };
      else userMap[v.user] = userMap[v.user] + 1;
    }
    for (const [key, value] of Object.entries(userMap))
      if (value >= 2) {
        const ass1_b = await User.findOne({ _id: key });
        cUser2_Order.push(ass1_b);
      }
    const { TopSell } = req.query;
    if (!TopSell) {
      res.json({
        '*theo thời gian tuỳ ý': AnaZone,
        voucher: {
          'số lượng': Vouchers.length,
          'tổng tiền': total_voucher_money,
        },
        'doanh thu tháng này': {
          'tháng này': doanh_thu,
          'tổng doanh thu': all_dth,
          'số đơn': list_doanhthu,
          'doanh thu khách vãn lai ': dt_ssUser2_Order,
        },

        'số user tham gia': {
          'tháng này': nUs.length,
          'tổng ': all_nUs.length,
          'khách vãn lai': c_ssUser2_Order,
        },
        TopSell: {
          'sản phẩm bán nhiều nhất': m_product,
          List: [sold_product],
        },
        'user mua 2 đơn trở lên': cUser2_Order,
      });
    } else {
      var newArr = [];
      for (const [key, value] of Object.entries(sold_product)) {
        newArr.push({ ...value, name: key });
      }
      return res.json(newArr);
    }
  },

  //Fillter theo lịch âm
  analysticFillter: async (req, res) => {
    try {
      //date -> y/m/d
      const done = await analyticController.fillterOrderByCalendar('done', req.body.date);
      const canceled = await analyticController.fillterOrderByCalendar('canceled', req.body.date);
      const confirmed = await analyticController.fillterOrderByCalendar('confirmed', req.body.date);
      const pending = await analyticController.fillterOrderByCalendar('pending', req.body.date);
      const data = {
        done,
        pending,
        canceled,
        confirmed,
      };
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
