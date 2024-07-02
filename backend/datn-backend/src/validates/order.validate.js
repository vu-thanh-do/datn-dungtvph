import joi from 'joi';

export const orderValidate = joi.object({
  user: joi.string(),
  payment_intent: joi.string(),
  payment_vnpay: joi.string().default(false),
  isPayment: joi.boolean(),
  items: joi.array().items(
    joi.object({
      name: joi.string(),
      image: joi.string(),
      product: joi.string().required(),
      quantity: joi.number().required(),
      price: joi.number().required(),
      toppings: joi.array().items(
        joi.object({
          _id: joi.string(),
          name: joi.string().required(),
          price: joi.number().required(),
        })
      ),
      size: joi.object({
        name: joi.string().required(),
        price: joi.number().required(),
        _id: joi.string().required(),
        is_default: joi.boolean(),
      }),
    })
  ),
  status: joi
    .string()
    .valid('pending', 'confirmed', 'delivered', 'done', 'canceled')
    .default('pending'),
  noteOrder: joi.string(),
  total: joi.number(),
  priceShipping: joi.number().default(0),
  paymentMethodId: joi.string().valid('cod', 'momo', 'zalopay', 'vnpay', 'stripe').default('cod'),
  inforOrderShipping: joi
    .object({
      name: joi.string().required(),
      address: joi.string().required(),
      email: joi.string().required(),
      phone: joi.string().required(),
      noteShipping: joi.string(),
    })

    .messages({
      'object.base': 'inforOrderShipping must be an object',
      'object.empty': 'inforOrderShipping must be an object',
      'any.required': 'inforOrderShipping is required',
    }),
  moneyPromotion: joi.object({
    price: joi.number().default(0),
    voucherId: joi.string(),
  }),
  is_active: joi.boolean().valid(true, false).default(true),
});
