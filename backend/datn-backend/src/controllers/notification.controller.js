import { json } from 'express';
import Notification from '../models/notification.model.js';

export const NotificationController = {
  createNotification: async (req, res) => {
    try {
      const body = req.body;
      const notification = await Notification.create({ ...body });
      if (!notification) {
        return res.status(400).json({ message: 'fail', err: 'create notification failed' });
      }
      return res.status(201).json({
        message: 'success',
        data: notification,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUnReadNotificationToAdmin: async (req, res) => {
    try {
      const notifications = await Notification.find({ is_read: false, to: 'admin' })
        .sort({ createdAt: -1 })
        .exec();
      if (notifications.length === 0) {
        return res.status(200).json({
          message: 'notification is empty',
        });
      }
      if (!notifications) {
        return res.status(400).json({ message: 'fail', err: 'get unread notification failed' });
      }
      return res.status(200).json({
        message: 'success',
        data: notifications,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getNotificationUnReadByIdUser: async (req, res) => {
    try {
      const { idUser } = req.params;
      const notifications = await Notification.find({ idUser: idUser, is_read: false })
        .sort({ createdAt: -1 })
        .exec();
      if (notifications.length === 0) {
        return res.status(200).json({
          message: 'notification is empty',
        });
      }
      if (!notifications) {
        return res.status(400).json({ message: 'fail', err: 'get unread notification failed' });
      }
      return res.status(200).json({
        message: 'success',
        data: notifications,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateIsReadNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await Notification.findByIdAndUpdate(
        id,
        { is_read: true },
        { new: true }
      );
      if (!notification) {
        return res.status(400).json({ message: 'fail', err: 'update notification failed' });
      }
      return res.status(200).json({
        message: 'update success',
        data: notification,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
