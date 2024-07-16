import express from 'express';
import newBlogsController from '../controllers/newsBlogs.controller.js';

const routerNewBlogs = express.Router();

routerNewBlogs.post('/create-newsBlog', newBlogsController.createNewBlogs);
routerNewBlogs.get('/newsBlog', newBlogsController.getAllNewBlogs);
// router.get('/order/:id', orderController.getById);
routerNewBlogs.put('/newsBlog/:id', newBlogsController.updateNewBlogs);
routerNewBlogs.delete('/newsBlog-remove/:id', newBlogsController.removeNewBlogs);

routerNewBlogs.get('/newBlog/:id', newBlogsController.getDetailNewBlog);
routerNewBlogs.put('/newsBlog-update/deleted/:id', newBlogsController.updateIsDeletedNewBlog);
routerNewBlogs.put('/newsBlog-update/active/:id', newBlogsController.updateIsActiveNewBlog);
routerNewBlogs.get('/newsBlog-update/active', newBlogsController.getAllNewBlogsActive);
routerNewBlogs.get('/newsBlog/deleted', newBlogsController.getAllBlogDeleted);

export default routerNewBlogs;
