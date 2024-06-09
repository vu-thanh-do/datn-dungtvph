import moment from 'moment';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

moment().format();

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    discount: { type: Number, require: true },
    sale: { type: Number, require: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, require: true },
    isActive: { type: Boolean, default: true },
    desc: {
      type: String,
      required: true,
    },
    user_used: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);
voucherSchema.plugin(mongoosePaginate);
const Voucher = mongoose.model('Voucher', voucherSchema);
export default Voucher;
