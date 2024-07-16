import Joi from 'joi';

export const categoryBlogValdiate = Joi.object({
  name: Joi.string().required(),
  is_active: Joi.boolean().default(true),
  is_deleted: Joi.boolean().default(false),
});
