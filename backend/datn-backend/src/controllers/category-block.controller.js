import { CategoryBlog } from '../models/category-blog.model.js';
import { categoryBlogValdiate } from '../validates/category-blog.validate.js';
import newBlogModel from '../models/newsBlogs.model.js';

export const categoryBlogController = {
  create: async (req, res) => {
    try {
      const body = req.body;
      const { error } = categoryBlogValdiate.validate(body);
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({ message: errors });
      }

      const data = await CategoryBlog.create(body);

      if (!data) {
        return res.status(400).json({ message: 'Create category blog failed' });
      }

      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  /* get all */
  getAll: async (req, res) => {
    try {
      const { _page = 1, _limit = 10, query = '' } = req.query;
      const options = {
        limit: _limit,
        page: _page,
        sort: { createdAt: -1 },
        populate: { path: 'blogs', },
      };

      if (query) {
        options.query = { name: { $regex: query, $options: 'i' } };
      }

      const data = await CategoryBlog.paginate({}, options);

      if (!data) {
        return res.status(400).json({ message: 'Get category blog failed' });
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await CategoryBlog.findById(id);
      if (category) {
        return res.status(200).json(category);
      }
      return res.status(400).json({ message: 'Category not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;

      const { error } = categoryBlogValdiate.validate(body);
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({ message: errors });
      }

      const categoryUpdate = await CategoryBlog.findByIdAndUpdate(id, body, { new: true });
      if (!categoryUpdate) {
        return res.status(400).json({ message: 'Update category failed' });
      }

      return res.status(200).json(categoryUpdate);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  /* delete */
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const categoryBlog = await CategoryBlog.findById(id);
      if (!categoryBlog) {
        return res.status(400).json({
          message: 'Danh mục blog không tồn tại!',
        });
      }
      const blogs = categoryBlog.blogs;
      if (blogs.length > 0) {
        const deleteBlogs = await newBlogModel.deleteMany({ _id: { $in: blogs } });
        if (!deleteBlogs) {
          return res.status(400).json({
            message: 'Xóa blogs thất bại',
          });
        }
      }
      const categoryDelete = await CategoryBlog.findByIdAndDelete(id);
      if (!categoryDelete) {
        return res.status(400).json({ message: 'Delete category failed' });
      }

      return res.status(200).json({ message: 'Delete category success' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },
};
