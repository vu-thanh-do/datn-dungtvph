import express from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
const router = express.Router();

router.get(
  '/get-unread-notifications-to-admin',
  NotificationController.getUnReadNotificationToAdmin
);
router.get(
  '/get-notifications-unread-by-id-user/:idUser',
  NotificationController.getNotificationUnReadByIdUser
);
router.post('/create-notification', NotificationController.createNotification);
router.put('/update-is-read-notification/:id', NotificationController.updateIsReadNotification);
export default router;
