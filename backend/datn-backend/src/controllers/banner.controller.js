import Banner from '../models/banner.model.js';
import { bannerValidate } from '../validates/banner.validate.js';

export const bannerController = {
  /* create */
  create: async (req, res) => {
    try {
      const body = req.body;
      const { error } = bannerValidate.validate(body, { abortEarly: false });
      if (error) {
        const erorrs = error.details.map((err) => err.message);
        return res.status(400).json({ msg: erorrs });
      }
      const banner = await Banner.create(body);
      return res.status(201).json({ banner });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const banner = await Banner.findByIdAndDelete(id);
      if (!banner) {
        return res.status(400).json({ msg: 'Banner not found' });
      }
      return res.status(200).json({ banner });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAll: async (_, res) => {
    try {
      const banners = await Banner.find();
      return res.status(200).json({ banners });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllIsActive: async (req, res) => {
    try {
      const status = req.query.status;
      const banners = await Banner.find({ is_active: status });
      return res.status(200).json({ banners });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  /* update is_active */
  updateIsActive: async (req, res) => {
    try {
      const { id } = req.params;
      const banner = await Banner.findById(id);
      if (!banner) {
        return res.status(400).json({ msg: 'Banner not found' });
      }
      const bannerUpdate = await Banner.findByIdAndUpdate(
        id,
        { is_active: !banner.is_active },
        { new: true }
      );
      return res.status(200).json({ bannerUpdate });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
