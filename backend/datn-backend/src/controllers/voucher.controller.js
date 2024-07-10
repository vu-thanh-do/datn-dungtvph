import Voucher from '../models/voucher.model.js';
import { voucherValidate } from '../validates/voucher.validate.js';

export const voucherController = {
  /* create */
  create: async (req, res) => {
    try {
      const body = req.body;

      /* validate */
      const { error } = voucherValidate.validate(body, { abortEarly: false });

      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({ message: errors });
      }
      //  check code đã tồn tại hay chưa

      const isCode = await Voucher.findOne({ code: body.code })
       
      if (isCode) {

        return res.status(400).json({ message: "Mã code đã tồn tại rồi!" });
      }
      /* create */
      const voucher = await Voucher.create({ ...body });
      if (voucher) {
        return res.status(201).json({ data: voucher });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* get all voucher */
  getAll: async (req, res) => {
    try {
      const { _page = 1, _limit = 10, q } = req.query;
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
      };
      const query = q ? { code: { $regex: new RegExp(q), $options: 'i' } } : {};
      const vouchers = await Voucher.paginate(query, options);
      return res.status(200).json({ data: vouchers });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* lấy ra các voucher còn hàng sử dụng vào có isActive là true */
  getActiveVoucher: async (req, res) => {
    try {
      const { _page = 1, _limit = 10, q } = req.query;
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
      };
      const query = q
        ? { code: { $regex: new RegExp(q), $options: 'i' }, isActive: true }
        : { isActive: true };
      /* lấy ra thời gian hiện tại để so sánh */
      const currentDate = new Date();
      /* lấy ra các voucher có startDate <= currentDate và endDate >= currentDate và còn hoạt động */
      query.startDate = { $lte: currentDate };
      query.endDate = { $gte: currentDate };
      const vouchers = await Voucher.paginate(query, options);
      return res.status(200).json({ data: vouchers });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* lấy ra 1 voucher */
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findById(id);
      if (voucher) {
        return res.status(200).json({ data: voucher });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* update voucher */
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;
      /* validate */
      const { error } = voucherValidate.validate(body, { abortEarly: false });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({ message: errors });
      }
      /* update */
      const voucher = await Voucher.findByIdAndUpdate(id, body, { new: true });
      if (!voucher) {
        return res.status(404).json({ message: 'Không tìm thấy Voucher  ' });
      }
      return res.status(200).json({ data: voucher });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* delete voucher */
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findByIdAndDelete(id);
      if (!voucher) {
        return res.status(404).json({ message: 'Không tìm thấy Voucher ' });
      }
      return res.status(200).json({ data: voucher });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
