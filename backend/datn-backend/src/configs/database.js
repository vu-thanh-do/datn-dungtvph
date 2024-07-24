import * as dotenv from 'dotenv';

import mongoose from 'mongoose';
import User from '../models/user.model.js';

dotenv.config();

export const connectDb = () => {
  mongoose
    .connect(process.env.MONGOOSE_LOCAL)
    .then(async () => {
      const adminUser = {
        _id: '999999999999999999999999', // ID cố định của bạn
        user: 'supporter',
        account:'supporter@gmail.com',
        password: '$2a$10$u63Hps4B/N/iZgjhKBYfhuEnW186R6jCqL4KGMCUvoy/JpqsmKSqu', // Mật khẩu của bạn
        role: 'admin'
      };
  
      const result = await User.findById(adminUser._id);
      if (!result) {
        await User.create(adminUser);
        console.log('Admin user created');
      } else {
        console.log('Admin user already exists');
      }
      console.log('Database connected!');
    })
    .catch((err) => console.log(err));
};
