import Topping from '../models/topping.model.js';
import toppingValidate from '../validates/topping.validate.js';

export const toppingController = {
  createTopping: async (req, res, next) => {
    try {
      const { error } = toppingValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const topping = await Topping.create(req.body);
   
      if (!topping) {
        return res.status(400).json({ message: 'fail', err: 'Thêm mới topping thất bại' });
      }
      return res.status(200).json({ message: 'success', data: topping });
    } catch (error) {
      next(error);
    }
  },
  getAllTopping: async (req, res, next) => {
    try {
      const topping = await Topping.find({}).sort({ createdAt: -1 });
      if (!topping) {
        return res.status(404).json({ message: 'fail', err: 'Không tìm thấy Topping' });
      }
      return res.status(200).json({ message: 'success', data: topping });
    } catch (error) {
      next(error);
    }
  },
  getTopping: async (req, res, next) => {
    try {
      const topping = await Topping.findById(req.params.id);
     
      if (!topping) {
        return res.status(404).json({ message: 'fail', err: 'Không tìm thấy Topping' });
      }
      return res.status(200).json({ message: 'success', data: topping });
    } catch (error) {
      next(error);
    }
  },
  updateTopping: async (req, res, next) => {
    try {
      const { error } = toppingValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const topping = await Topping.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!topping) {
        return res.status(404).json({ message: 'fail', err: 'Không tìm thấy Topping' });
      }
      return res.status(200).json({ message: 'success', data: topping });
    } catch (error) {
      next(error);
    }
  },
  deleteTopping: async (req, res, next) => {
    try {
      const topping = await Topping.findByIdAndRemove(req.params.id);
      if (!topping) {
        return res.status(404).json({ message: 'fail', err: 'Không tìm thấy Topping' });
      }
      return res.status(200).json({ message: 'success', data: topping });
    } catch (error) {
      next(error);
    }
  },
};
