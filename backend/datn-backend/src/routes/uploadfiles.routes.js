import { deleteImage, updateImage, uploadImage } from '../middlewares/uploadImage.js';

import { ErrorUpload } from '../middlewares/errorUploadFile.js';
import express from 'express';
import multer from 'multer';
import multerConfig from '../configs/multer.config.js';

const uploadRouter = express.Router();
const uploads = multer({
  storage: multerConfig.storage,
  fileFilter: multerConfig.fileFilter,
});

uploadRouter.post('/uploadImages', uploads.array('images', 10), uploadImage, ErrorUpload);
uploadRouter.delete('/deleteImages/:publicId', deleteImage);
uploadRouter.put('/updateImages/:publicId', uploads.array('images'), updateImage, ErrorUpload);

export default uploadRouter;
