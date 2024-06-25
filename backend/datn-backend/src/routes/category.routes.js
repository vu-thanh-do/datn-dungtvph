import express from 'express';
import { categoryController } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/categories', categoryController.getAll);
router.get('/categories-isDeleted', categoryController.getAllCategoryDeleted);
router.get('/category/:id', categoryController.getOne);
router.post('/category', categoryController.create);
router.put('/category-deleteFake/:id', categoryController.fakeDelete);
router.put('/category-restore/:id', categoryController.restore);
router.delete('/category/:id', categoryController.deleteReal);
router.put('/category/:id', categoryController.update);

export default router;
