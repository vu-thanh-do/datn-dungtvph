import AuthRouter from './auth.router.js';
import sizeRoutes from './size.routes.js';
import toppingRoutes from './topping.routes.js';
import uploadRouter from './uploadfiles.routes.js';
import UserRoutes from './user.routers.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import express from 'express';
const router = express.Router();
const rootRoutes = [UserRoutes, AuthRouter, uploadRouter, sizeRoutes, toppingRoutes,productRoutes,categoryRoutes];
rootRoutes.map((route) => {
  router.use(route);
});

export default rootRoutes;
