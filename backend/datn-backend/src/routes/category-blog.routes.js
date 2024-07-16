import { categoryBlogController } from '../controllers/category-block.controller.js';
import express from 'express';

const router = express.Router();

router.post('/category-blog', categoryBlogController.create);
router.get('/category-blogs', categoryBlogController.getAll);
router.get('/category-blog/:id', categoryBlogController.getOne);
router.put('/category-blog/:id', categoryBlogController.update);
router.delete('/category-blog/:id', categoryBlogController.delete);

export default router;
