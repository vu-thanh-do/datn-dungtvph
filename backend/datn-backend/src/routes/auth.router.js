import express from 'express';
import { userController } from '../controllers/index.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/refreshToken', userController.handleRefreshToken);

export default router;
