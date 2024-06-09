import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const checkoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    note: {
      type: String,
    },
    totalPrice: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

checkoutSchema.plugin(mongoosePaginate);

const Checkout = mongoose.model('Payment', checkoutSchema);

export default Checkout;
