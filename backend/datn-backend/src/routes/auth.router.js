import express from 'express';
import { userController } from '../controllers/index.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/refreshToken', userController.handleRefreshToken);
router.post('/forgot-password', userController.sendMailForgotPassword);
router.put('/reset-password/:token', userController.resetPassword);
export default router;
