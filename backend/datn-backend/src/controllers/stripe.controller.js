import Stripe from 'stripe';
import dotenv from 'dotenv';
import { generatePaymentToken } from '../configs/token.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import jwt from 'jsonwebtoken';
import Order from '../models/order.model.js';
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const CheckoutStripe = {
  payment: async (req, res) => {
    try {
      const { user, items, priceShipping, noteOrder, inforOrderShipping } = req.body;
      const dataOrder = {
        user: user,
        noteOrder: noteOrder,
        noteShipping: inforOrderShipping.noteShipping,
      };
     
      const encodeStripe = generatePaymentToken(dataOrder);
      const line_items = items.map(({ image, name, quantity, product, price, size, toppings }) => {
        const arrayPriceTopping =
          toppings?.length > 0
            ? toppings.map((topping) => {
                return topping.price;
              })
            : [];
        const totalPriceTopping =
          arrayPriceTopping?.length > 0
            ? arrayPriceTopping.reduce((a, b) => {
                return a + b;
              })
            : 0;
        const arrayNametopping =
          toppings?.length > 0
            ? toppings.map((topping) => {
                return `${topping.name} (${formatCurrency(topping.price)})`;
              })
            : '';
        const topping =
          arrayNametopping.length > 0 ? '[ ' + arrayNametopping.join(' - ') + ' ]' : '';
        return {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: `${name} (${size.name}) ${topping}`,
              images: [image],
              metadata: {
                productId: product,
                productName: name,
                sizeId: size._id,
                sizeName: size.name,
                sizePrice: size.price,
                topping: JSON.stringify(toppings),
              },
            },
            unit_amount: price + totalPriceTopping,
          },
          quantity: quantity,
          adjustable_quantity: {
            enabled: true,
            minimum: 0,
            maximum: 1000,
          },
        };
      });
      const customer = await stripe.customers.create({
        name: `${inforOrderShipping.name}`,
        phone: `+84 ${inforOrderShipping.phone}`,
        address: {
          line1: inforOrderShipping.address,
        },
        metadata: {
          userId: user,
          payment: 'stripe',
          encode: encodeStripe,
        },
      });
      // const coupon = await stripe.coupons.create({
      //   currency: 'vnd',
      //   amount_off: 20,
      //   duration: 'once',
      // });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: line_items,
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: priceShipping,
                currency: 'vnd',
              },
              display_name: 'shipping',
            },
          },
        ],
        // discounts: [
        //   {
        //     coupon: coupon.id,
        //   },
        // ],
        success_url: `${process.env.RETURN_URL}/products/checkout/payment-result?encode=${encodeStripe}`,
        cancel_url: `${process.env.RETURN_URL}/products/checkout`,
        expires_at: new Date(Date.now() + 30 * 60 * 1000),
        customer: customer.id,
        phone_number_collection: {
          enabled: true,
        },
        custom_fields: [
          {
            key: 'note_order',
            label: {
              type: 'custom',
              custom: 'Note Order',
            },
            optional: true,
            type: 'text',
          },
          {
            key: 'note_shipping',
            label: {
              type: 'custom',
              custom: 'Note Shipping',
            },
            optional: true,
            type: 'text',
          },
        ],
        locale: 'vi',
      });
      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });
      res.send({ url: session.url });
    } catch (error) {
      return res.status(500, { message: 'Error server' });
    }
  },

  Billing: async (req, res) => {
    try {
      const invoiceId = req.cookies.sessionId;
      if (invoiceId) {
        const invoice = await stripe.checkout.sessions.retrieve(invoiceId, {
          expand: ['line_items.data.price.product', 'customer'],
        });
        const decodedToken = jwt.verify(invoice.customer.metadata.encode, process.env.JWT_STRIPE);
        

        const line_items = invoice.line_items.data.map((item) => {
          return {
            image: item.price.product.images[0],
            price: item.price.unit_amount,
            product: item.price.product.metadata.productId,
            size: {
              _id: item.price.product.metadata.sizeId,
              name: item.price.product.metadata.sizeName,
              price: item.price.product.metadata.sizePrice,
            },
            toppings: JSON.parse(item.price.product.metadata.topping),
            quantity: item.quantity,
          };
        });

        const Order = {
          user: invoice.customer.metadata.userId,
          payment_intent: invoice.payment_intent,
          items: line_items,
          total: invoice.amount_total,
          priceShipping: invoice.shipping_options[0].shipping_amount,
          noteOrder: invoice.custom_fields[0].text.value
            ? invoice.custom_fields[0].text.value
            : decodedToken.noteOrder,
          paymentMethodId: invoice.customer.metadata.payment,
          inforOrderShipping: {
            name: invoice.customer.name,
            phone: invoice.customer.phone,
            address: invoice.customer.address.line1,
            noteShipping: invoice.custom_fields[1].text.value
              ? invoice.custom_fields[1].text.value
              : decodedToken.noteShipping,
          },
        };

        
        res.clearCookie('sessionId');
        return res.send({ invoice: Order });
      }

      return res.status(400, { message: 'Invalid' });
    } catch (error) {
      return res.status(500, { message: 'Error server' });
    }
  },

  RefundMoney: async (req, res) => {
    try {
      const { id } = req.body;
      const OrderUser = await Order.findById(id);
      if (OrderUser) {
        return res.status(400, { message: 'Not found Order to refund' });
      }
     
      // const refund = await stripe.refunds.create({
      //   payment_intent: 'pi_Aabcxyz01aDfoo',
      //   amount: 1000,
      // });
    } catch (error) {
      return res.status(500, { message: 'Error server' });
    }
  },
};

export default CheckoutStripe;
