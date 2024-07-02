import express from 'express';
import { cartController } from '../controllers/cart.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/carts', authMiddleware.verifyToken, cartController.getAllCart);
router.post('/cart', authMiddleware.verifyToken, cartController.createCart);
router.get('/cart/:id', authMiddleware.verifyToken, cartController.getOneCart);
router.put('/cart/:id', authMiddleware.verifyToken, cartController.updateCart);
router.delete('/cart/:cartItemId', authMiddleware.verifyToken, cartController.deleteCart);
router.delete('/cartofuser/:id', authMiddleware.verifyToken, cartController.deleteCart);

/* thêm sản phẩm vào giỏ hàng */
// router.post('/cart/add', cartController.addCart);

export default router;
