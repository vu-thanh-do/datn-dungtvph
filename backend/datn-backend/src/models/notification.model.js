import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    idUser: {
      type: String,
    },
    idOrder: {
      type: String,
      // required: true,
    },
    content: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
