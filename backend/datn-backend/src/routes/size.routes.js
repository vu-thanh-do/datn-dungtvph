import { SizeController } from '../controllers/size.controller.js';
import express from 'express';

const sizeRoutes = express.Router();

sizeRoutes.route('/sizes').get(SizeController.getAllSize);
sizeRoutes.route('/size').post(SizeController.createSize);
sizeRoutes.route('/size/default').get(SizeController.getAllSizeDefault);
sizeRoutes
  .route('/size/:id')
  .delete(SizeController.deleteSize)
  .get(SizeController.getSize)
  .put(SizeController.updateSize);

export default sizeRoutes;
