import Size from '../models/size.model.js';
import SizeValidate from '../validates/size.validate.js';

export const SizeController = {
  createSize: async (req, res, next) => {
    try {
      const { error } = SizeValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const size = await Size.create(req.body);
      if (!size) {
        return res.status(400).json({ message: 'fail', err: 'create size failed' });
      }

      return res.status(200).json({ message: 'success', data: size });
    } catch (error) {
      next(error);
    }
  },

  getAllSize: async (req, res, next) => {
    try {
      const { _page = 1, limit = 10, q } = req.query;
      const options = {
        page: _page,
        limit: limit,
        sort: { createdAt: -1 },
        populate: [],
      };
      const query = q ? { name: { $regex: new RegExp(q), $options: 'i' } } : {};
      const size = await Size.paginate(query, options);
      if (!size) {
        return res.status(404).json({ message: 'fail', err: 'Not found any size' });
      }
      return res.status(200).json({ ...size });
    } catch (error) {
      next(error);
    }
  },

  getSize: async (req, res, next) => {
    try {
      const size = await Size.findById(req.params.id);
      if (!size) {
        return res.status(404).json({ message: 'fail', err: 'Not found Size' });
      }
      return res.status(200).json({ message: 'success', data: size });
    } catch (error) {
      next(error);
    }
  },

  updateSize: async (req, res, next) => {
    try {
      const { error } = SizeValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const size = await Size.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!size) {
        return res.status(404).json({ message: 'fail', err: 'Not found Size to update' });
      }
      return res.status(200).json({ message: 'success', data: size });
    } catch (error) {
      next(error);
    }
  },

  deleteSize: async (req, res, next) => {
    try {
      const size = await Size.findByIdAndRemove(req.params.id);
      if (!size) {
        return res.status(404).json({ message: 'fail', err: 'Not found Size to delete' });
      }
      return res.status(200).json({ message: 'success', data: size });
    } catch (error) {
      next(error);
    }
  },

  /* lấy ra tất cả các size có is_default là true */
  getAllSizeDefault: async (req, res, next) => {
    try {
      const size = await Size.find({ is_default: true });

      if (!size) {
        return res.status(404).json({ message: 'fail', err: 'Not found any size' });
      }
      return res.status(200).json({ message: 'success', data: size });
    } catch (error) {
      next(error);
    }
  },
};
