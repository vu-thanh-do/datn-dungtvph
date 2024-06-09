import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const categoryBlogSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsBlog',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categoryBlogSchema.plugin(mongoosePaginate);

export const CategoryBlog = mongoose.model('CategoryBlog', categoryBlogSchema);
