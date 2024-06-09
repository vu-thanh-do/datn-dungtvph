import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const toppingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      require: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true, versionKey: false }
);

toppingSchema.plugin(mongoosePaginate);

const Topping = mongoose.model('Topping', toppingSchema);

export default Topping;
