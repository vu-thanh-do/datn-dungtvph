import express from 'express';
import checkoutVnpay from '../controllers/vnpay.contrller.js';
const vnpayRoutes = express.Router();

vnpayRoutes.post('/create-checkout-vnpay', checkoutVnpay.payment);

export default vnpayRoutes;
