import * as dotenv from 'dotenv';

import mongoose from 'mongoose';

dotenv.config();

export const connectDb = () => {
  mongoose
    .connect(process.env.MONGOOSE_LOCAL)
    .then(() => console.log('Database connected!'))
    .catch((err) => console.log(err));
};
