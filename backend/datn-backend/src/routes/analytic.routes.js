import { analyticController } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

/* order */
router.get('/countOrder', analyticController.countOrder);
router.get('/countOrderWeek', analyticController.countOrderWeek);
/* đếm số order theo sản phẩm */
router.get('/countOrderDayByProduct', analyticController.countOrderDayByProduct);
/* đếm số lượng người dùng */
router.get('/countUser', analyticController.countUser);

router.get('/analytics', analyticController.analytics);
router.get('/analyst', analyticController.analysticTotal);
router.post('/analyst-fillter', analyticController.analysticFillter);
router.get('/analytics-month', analyticController.analyticMonth);

export default router;
