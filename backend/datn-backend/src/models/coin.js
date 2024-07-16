import moment from 'moment';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const coin = mongoose.model(
  'coin',
  mongoose.Schema(
    {
      name: String,
      money: Number,
    },
    { timestamps: true, versionKey: false }
  )
);

export default coin;
