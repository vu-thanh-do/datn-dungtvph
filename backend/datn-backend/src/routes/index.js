import AuthRouter from './auth.router.js';
import sizeRoutes from './size.routes.js';
import toppingRoutes from './topping.routes.js';
import uploadRouter from './uploadfiles.routes.js';
import UserRoutes from './user.routers.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import cartRouter from './cart.routes.js';
import orderRoutes from './order.routes.js';
import express from 'express';
import uploadBanner from './banner.routes.js';
import voucherRoutes from './voucher.routes.js';
import newBlogRouter from './newsBlogs.routes.js';
import categoryBlogRoutes from './category-blog.routes.js';
import analyticRoutes from './analytic.routes.js';
import vnpayRoutes from './vnpay.rotues.js';
import addressRouter from './address.routes.js';

const router = express.Router();
const rootRoutes = [
  UserRoutes,
  AuthRouter,
  uploadRouter,
  sizeRoutes,
  toppingRoutes,
  productRoutes,
  categoryRoutes,
  orderRoutes,
  cartRouter,
  uploadBanner,
  voucherRoutes,
  newBlogRouter,
  categoryBlogRoutes,
  analyticRoutes,
  vnpayRoutes,
  addressRouter
];
rootRoutes.map((route) => {
  router.use(route);
});

export default rootRoutes;
