import express from 'express';
import { toppingController } from '../controllers/topping.controller.js';

const toppingRoutes = express.Router();
toppingRoutes.route('/toppings').get(toppingController.getAllTopping);
toppingRoutes.route('/topping').post(toppingController.createTopping);
toppingRoutes
  .route('/topping/:id')
  .get(toppingController.getTopping)
  .delete(toppingController.deleteTopping)
  .put(toppingController.updateTopping);

export default toppingRoutes;
