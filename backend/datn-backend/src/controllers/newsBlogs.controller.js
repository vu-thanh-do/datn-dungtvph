import { CategoryBlog } from '../models/category-blog.model.js';
import joi from 'joi';
import newBlogModel from '../models/newsBlogs.model.js';

// Định nghĩa schema sử dụng Joi để kiểm tra dữ liệu đầu vào
const newsBlogSchema = joi.object({
  name: joi.string().required(),
  images: joi
    .object({
      url: joi.string(),
      publicId: joi.string(),
      filename: joi.string(),
    })
    .unknown(true),
  description: joi.string().required(),
  category: joi.string().required(),
  is_active: joi.boolean().default(true),
  is_deleted: joi.boolean().default(false),
});

// Lấy tất cả tin tức từ cơ sở dữ liệu
const newBlogsController = {
  getAllNewBlogs: async (req, res) => {
    const { _limit = 10, _sort = 'createAt', _order = 'asc', _page = 1 } = req.query;

    const options = {
      limit: _limit,
      page: _page,
      sort: { [_sort]: _order === 'desc' ? -1 : 1 },
      populate: { path: 'category', select: 'name' },
    };

    try {
      const data = await newBlogModel.paginate({}, options);
      if (data.docs.length === 0) {
        // Kiểm tra xem có dữ liệu không
        return res.status(200).json({ message: 'Không có dữ liệu' });
      }

      return res.json(data);
    } catch (error) {
      return res.status(500).json({
        // Sử dụng mã lỗi 500 cho lỗi server
        message: error.message,
      });
    }
  },
  // Tạo mới tin tức
  createNewBlogs: async (req, res) => {
    try {
      const { error } = newsBlogSchema.validate(req.body, { abortEarly: false });

      if (error) {
        // Kiểm tra lỗi từ Joi
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }

      const newBlogs = await newBlogModel.create(req.body);

      if (!newBlogs) {
        // Kiểm tra xem có tạo mới tin tức không
        return res.status(400).json({
          message: 'Tạo mới tin tức không thành công',
        });
      }

      /* update id to category */
      await CategoryBlog.findByIdAndUpdate(req.body.category, {
        $addToSet: { blogs: newBlogs._id },
      });

      return res.status(201).json(newBlogs); // Sử dụng mã lỗi 201 cho tạo mới thành công
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  // Cập nhật tin tức theo ID
  updateNewBlogs: async (req, res) => {
    try {
      const blog = await newBlogModel.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Không tìm thấy tin tức' });
      }

      const { error } = newsBlogSchema.validate(req.body, { abortEarly: false });
      if (error) {
        // Kiểm tra lỗi từ Joi
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }

      /* update category */
      await CategoryBlog.findByIdAndUpdate(blog.category, {
        $pull: { blogs: blog._id },
      });

    

      const data = await newBlogModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
      });

      if (!data) {
        // Kiểm tra xem có tin tức nào cập nhật không
        return res.status(404).json({ message: 'Cập nhật tin tức không thành công' });
      }

      /* update category */
      if (req.body.category) {
        await CategoryBlog.findByIdAndUpdate(req.body.category, {
          $addToSet: { blogs: data._id },
        });
      }

      return res.json(data);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  // Xóa tin tức theo ID
  removeNewBlogs: async (req, res) => {
    try {
      const data = await newBlogModel.findOneAndDelete({ _id: req.params.id });

      if (!data) {
        // Kiểm tra xem có tin tức nào được xóa không
        return res.status(404).json({
          message: 'Không tìm thấy tin tức để xóa',
        });
      }

      return res.json({
        message: 'Xóa tin tức thành công',
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  /* lấy chi tiết 1 bài blog */
  getDetailNewBlog: async (req, res) => {
    try {
      const data = await newBlogModel.findOne({ _id: req.params.id });

      if (!data) {
        // Kiểm tra xem có tin tức nào được xóa không
        return res.status(404).json({
          message: 'Không tìm thấy tin tức',
        });
      }

      return res.json(data);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  /* update is_deleted */
  updateIsDeletedNewBlog: async (req, res) => {
    try {
      const status = req.query.status;
      const data = await newBlogModel.findOneAndUpdate(
        { _id: req.params.id },
        { is_deleted: status },
        {
          new: true,
        }
      );

      if (!data) {
        // Kiểm tra xem có tin tức nào cập nhật không
        return res.status(404).json({
          message: 'Cập nhật tin tức không thành công',
        });
      }

      return res.json(data);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  /* update is_active */
  updateIsActiveNewBlog: async (req, res) => {
    try {
      const status = req.query.status;
      const data = await newBlogModel.findOneAndUpdate(
        { _id: req.params.id },
        { is_active: status },
        {
          new: true,
        }
      );

      if (!data) {
        // Kiểm tra xem có tin tức nào cập nhật không
        return res.status(404).json({
          message: 'Cập nhật tin tức không thành công',
        });
      }

      return res.json(data);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  /* get all is_deleted = false, is_active = true */
  getAllNewBlogsActive: async (req, res) => {
    const { _limit = 10, _sort = 'createAt', _order = 'asc', _page = 1 } = req.query;

    const options = {
      limit: _limit,
      page: _page,
      sort: { [_sort]: _order === 'desc' ? -1 : 1 },
      populate: { path: 'category', select: 'name' },
    };
    try {
      const data = await newBlogModel.paginate({ is_deleted: false, is_active: true }, options);

      if (data.length === 0) {
        // Kiểm tra xem có dữ liệu không
        return res.status(200).json({
          message: 'Không có dữ liệu',
        });
      }

      return res.json(data);
    } catch (error) {
      return res.status(500).json({
        // Sử dụng mã lỗi 500 cho lỗi server
        message: error.message,
      });
    }
  },
  getAllBlogDeleted: async (req, res) => {
    const { _limit = 10, _sort = 'createAt', _order = 'asc', _page = 1 } = req.query;

    const options = {
      limit: _limit,
      page: _page,
      sort: { [_sort]: _order === 'desc' ? -1 : 1 },
      populate: { path: 'category', select: 'name' },
    };
    try {
      const data = await newBlogModel.paginate({ is_deleted: true }, options);

      if (data.length === 0) {
        // Kiểm tra xem có dữ liệu không
        return res.status(200).json({
          message: 'Không có dữ liệu',
        });
      }

      return res.json(data);
    } catch (error) {
      return res.status(500).json({
        // Sử dụng mã lỗi 500 cho lỗi server
        message: error.message,
      });
    }
  },
};
export default newBlogsController;
