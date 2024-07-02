import express from 'express';
import { orderController } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create-order', orderController.create);
router.get('/orders', orderController.getAll);
router.get('/order/:id', orderController.getById);
router.put('/order/confirmed/:id', orderController.confirmOrder);
router.put('/order/delivered/:id', orderController.deliveredOrder);
router.put('/order/done/:id', orderController.doneOrder);
router.put('/order/canceled/:id', orderController.canceledOrder);
router.put('/order/pending/:id', orderController.pendingOrder);
router.delete('/order/:id', orderController.deleteOrder);
router.get('/order-confirmed', orderController.getAllOrderConfirmed);
router.get('/order-delivered', orderController.getAllOrderDelivered);
router.get('/order-done', orderController.getAllOrderDone);
router.get('/order-canceled', orderController.getAllOrderCanceled);
router.get('/order-pending', orderController.getAllOrderPending);
router.post('/order-update', orderController.updateOrderPending);
router.get('/order-user/:id', orderController.getAllOrderByUserId);

export default router;
