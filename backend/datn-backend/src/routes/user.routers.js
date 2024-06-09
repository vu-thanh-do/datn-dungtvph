import { authMiddleware } from '../middlewares/authMiddleware.js';
import express from 'express';
import { userController } from '../controllers/user.controllers.js';

const router = express.Router();
router.get('/users', userController.getAllUser);
router.get('/users/roles/:roleName', userController.getAllRoleUser);
router.put('/user/role/:idUser', authMiddleware.verifyTokenAdmin, userController.isActiveUser);
router.get('/users/:id', authMiddleware.verifyToken, userController.getUser);

router.patch('/updateInfor/:id', userController.updateInfor);
router.patch('/users/:id', userController.updateUser);
router.patch('/user/updatePassword', authMiddleware.verifyToken, userController.updatePassword);

router.route('/changeRoleUser/:id/:role').put(userController.changeRoleUser);
// post
router.route('/logout').post(userController.logOut);
// delete
router.delete('/users/:id', userController.deleteUser);

/* thêm người dùng */
router.post('/users', userController.createUser);
//lấy role admin và staff
router.get('/user-admin-staff-role', userController.getAllAdminAndStaff);

export default router;
