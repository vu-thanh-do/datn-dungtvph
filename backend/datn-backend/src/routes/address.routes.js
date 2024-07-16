import { addressController } from '../controllers/address.controller.js';
import express from 'express';
const router = express.Router();
router.post('/address/create', addressController.createAddress);
router.put('/address/update/:id', addressController.updateAddress);
router.get('/address/get/:userId', addressController.getAllAddressByUserId);
router.delete('/address/delete/:id', addressController.deleteAddress);
const addressRouter = router;
export default addressRouter;
