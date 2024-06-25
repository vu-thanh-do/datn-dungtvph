import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import { categoryValidate } from '../validates/index.js';
import slugify from 'slugify';

export const categoryController = {
  /* create */
  create: async (req, res) => {
    try {
      const body = req.body;
      /* validate */
      const { error } = categoryValidate.validate(body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      // /* create slug */
      const slug = slugify(body.name, { lower: true });
       
      body.slug = slug;
      // /* create */
      const category = await Category.create(body);
      if (!category) {
        return res.status(400).json({ message: 'Thêm mới danh mục thất bại' });
      }
      return res.status(201).json({ data: category });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  /* getAll */
  getAll: async (req, res) => {
    try {
      const { _page = 1, _limit = 10, q } = req.query;
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: { path: 'products' },
      };
      const query = q
        ? {
            $and: [
              {
                $or: [
                  { name: { $regex: q, $options: 'i' } },
                  { slug: { $regex: q, $options: 'i' } },
                  { is_deleted: false },
                ],
              },
            ],
          }
        : { is_deleted: false };
      const categories = await Category.paginate(query, options);
      return res.status(200).json({ ...categories });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  /*get status is_deleted = true */
  getAllCategoryDeleted: async (req, res) => {
    try {
      const { _page = 1, _limit = 10, q } = req.query;
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: { path: 'products' },
      };
      const query = q
        ? {
            $and: [
              {
                $or: [
                  { name: { $regex: q, $options: 'i' } },
                  { slug: { $regex: q, $options: 'i' } },
                  { is_deleted: true },
                ],
              },
            ],
          }
        : { is_deleted: true };
      const categories = await Category.paginate(query, options);
      return res.status(200).json({ ...categories });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  /* get One */
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id).populate('products');
      return res.status(201).json({ ...category._doc });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  /* update */
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;
      /* validate */
      const { error } = categoryValidate.validate(body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      /* create slug */
      const slug = slugify(body.name, { lower: true });
      body.slug = slug;
      /* update */
      const category = await Category.findByIdAndUpdate(id, body, { new: true });
      if (!category) {
        return res.status(400).json({ message: 'Cập nhập danh mục thất bại' });
      }
      return res.status(201).json({ data: category });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  /* xóa nứng */
  deleteReal: async (req, res) => {
    try {
      const { id } = req.params;
      /* find category and delete product */
      const category = await Category.findById(id);
      if (!category) {
        return res.status(400).json({ message: 'Danh mục không tồn tại' });
      }
      /* delete product */
      const products = category.products;
      if (products.length > 0) {
        const deleteProducts = await Product.deleteMany({ _id: { $in: products } });
        if (!deleteProducts) {
          return res.status(400).json({ message: 'Xóa sản phẩm thất bại' });
        }
      }
      /* delete category */
      const deleteCategory = await Category.findByIdAndDelete(id);
      if (!deleteCategory) {
        return res.status(400).json({ message: 'Xóa danh mục thất bại' });
      }
      return res.status(201).json({ data: category });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  /* xóa mềm */
  fakeDelete: async (req, res) => {
    try {
      const { id } = req.params;
      /* find category */
      const category = await Category.findById(id);
      if (!category) {
        return res.status(400).json({ message: 'Danh mục không tồn tại' });
      }
      /* thay đổi trạng thái của product false -> true */
      const products = category.products;
      if (products.length > 0) {
        const updateProducts = await Product.updateMany(
          { _id: { $in: products } },
          { is_deleted: true },
          { new: true }
        );
        if (!updateProducts) {
          return res.status(400).json({ message: 'Xóa sản phẩm thất bại' });
        }
      }
      /* update category */
      const updateCategory = await Category.findByIdAndUpdate(
        id,
        { is_deleted: true },
        { new: true }
      );
      if (!updateCategory) {
        return res.status(400).json({ message: 'Xóa danh mục thất bại' });
      }
      return res.status(201).json({ data: updateCategory });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  /* khôi phục lại */
  restore: async (req, res) => {
    try {
      const { id } = req.params;
      /* find category */
      const category = await Category.findById(id);
      if (!category) {
        return res.status(400).json({ message: 'Danh mục không tồn tại' });
      }
      /* thay đổi trạng thái của product true -> false */
      const products = category.products;
      if (products.length > 0) {
        const updateProducts = await Product.updateMany(
          { _id: { $in: products } },
          { is_deleted: false },
          { new: true }
        );
        if (!updateProducts) {
          return res.status(400).json({ message: 'Xóa sản phẩm thất bại' });
        }
      }
      /* update category */
      const updateCategory = await Category.findByIdAndUpdate(
        id,
        { is_deleted: false },
        { new: true }
      );
      if (!updateCategory) {
        return res.status(400).json({ message: 'Xóa danh mục thất bại' });
      }
      return res.status(201).json({ data: updateCategory });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};
