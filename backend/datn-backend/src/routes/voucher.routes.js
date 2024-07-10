import express from 'express';
import { voucherController } from '../controllers/voucher.controller.js';

const router = express.Router();

router.post('/voucher', voucherController.create);
router.get('/vouchers', voucherController.getAll);
router.get('/vouchers/active', voucherController.getActiveVoucher);
router.get('/voucher/:id', voucherController.getOne);
router.put('/voucher/:id', voucherController.update);
router.delete('/voucher/:id', voucherController.delete);

export default router;
