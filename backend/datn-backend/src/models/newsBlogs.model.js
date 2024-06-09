import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const newsBlog = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [{ url: String, publicId: String, filename: String }],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'CategoryBlog',
    },
    description: {
      type: String,
      require: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);
newsBlog.plugin(mongoosePaginate);

const newBlogModel = mongoose.model('NewsBlog', newsBlog);
export default newBlogModel;
