import { ErrorUpload } from '../middlewares/errorUploadFile.js';
import { bannerController } from '../controllers/banner.controller.js';
import express from 'express';
import multer from 'multer';
import multerConfig from '../configs/multer.config.js';
import { uploadImage } from '../middlewares/uploadImage.js';

const uploadBanner = express.Router();

const uploads = multer({
  storage: multerConfig.storage,
  fileFilter: multerConfig.fileFilter,
});

uploadBanner.post('/upload-banner', uploads.array('images'), uploadImage, ErrorUpload);
uploadBanner.post('/banner', bannerController.create);
uploadBanner.delete('/banner/:id', bannerController.delete);
uploadBanner.get('/banners', bannerController.getAll);

uploadBanner.get('/banners-is-active', bannerController.getAllIsActive);
// {{host}}/banners-is-active?status=true
uploadBanner.put('/banner/:id', bannerController.updateIsActive);

export default uploadBanner;
