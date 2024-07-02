import Cart from '../models/cart.model.js';
import { cartValidate } from '../validates/cart.js';

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}
export const cartController = {
  /* create Cart */
  createCart: async (req, res) => {
    try {
      const { _id } = req.user;
      const { error } = cartValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          message: 'fail',
          err: error.details.map((err) => err.message),
        });
      }

      const cart = await Cart.findOne({ user: _id, name: req.body.name }).populate([
        {
          path: 'items.toppings',
          select: 'name price _id',
        },
        {
          path: 'items.size',
          select: 'name price _id',
        },
      ]);

      if (cart) {
        let cartItemFound = false;
        let toppingMatch = false;

        for (let i = 0; i < cart.items.length; i++) {
          for (let j = 0; j < req.body.items.length; j++) {
            if (cart.items[i].size?._id.toString() === req.body.items[j].size) {

              toppingMatch = true;

              if (req.body.items[j].toppings.length === cart.items[i].toppings.length) {
                for (let k = 0; k < cart.items[i].toppings.length; k++) {
                  if (cart.items[i].toppings[k]._id.toString() !== req.body.items[j].toppings[k]) {
                    toppingMatch = false;
                    break;
                  }
                }
              } else {
                toppingMatch = false;
              }

              if (toppingMatch) {
                cart.items[i].quantity += req.body.items[j].quantity;
                cart.items[i].total = cart.items[i].price * cart.items[i].quantity;
                cartItemFound = true;
                break;
              }
            }
          }

          if (cartItemFound) {
            break;
          }
        }

        if (!cartItemFound) {
          const newItem = req.body.items[0];
          const existingItem = cart.items.find(
            (item) => item.name === newItem.name && item.size?._id.toString() === newItem.size
          );

          if (existingItem) {
            const matchingToppings = cart.items.filter(
              (item) =>
                item.name === newItem.name &&
                item.size?._id.toString() === newItem.size &&
                !arraysEqual(item.toppings, newItem.toppings)
            );

            if (matchingToppings.length > 0) {
              cart.items.push(newItem);
            } else {
              existingItem.quantity += newItem.quantity;
              existingItem.total = existingItem.price * existingItem.quantity;
            }
          } else {
            cart.items.push(newItem);
          }
        }

        await cart.save();

      } else {
        await new Cart({
          user: _id,
          name: req.body.name,
          items: req.body.items,
        }).save();
      }

      return res.status(200).json({
        message: 'success',
        data: req.body,
      });
    } catch (err) {
      return res.status(500).json({
        message: 'fail',
        err: 'Server error',
      });
    }
  },
  /* get all Cart */
  getAllCart: async (req, res) => {
    try {
      const { _id } = req.user;
      const cartAll = await Cart.find({ user: _id })
        .populate([
          // {
          //   path: 'items.product',
          //   select: 'name',
          //   select: '-is_deleted -is_active -createdAt -updatedAt',
          //   select: '_id',
          // },
          {
            path: 'items.toppings',
            // select: '-isActive -isDeleted -updatedAt -products'
            select: 'name price _id',
          },
          {
            path: 'items.size',
            // select: '-is_deleted -is_active -createdAt'
            select: 'name price _id',
          },
        ])
        .select('-user')
        .exec();

      return res.json({
        message: 'Cart all successfully',
        data: cartAll,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  /* get one Cart */
  getOneCart: async (req, res) => {
    try {
      const { _id } = req.user;

      const cart = await Cart.findOne({
        user: _id,
        _id: req.params.id,
      })
        .populate([
          // {
          // path: 'items.product',
          // select: '-is_deleted -is_active -createdAt -updatedAt',
          // select: '_id',
          // },
          {
            path: 'items.toppings',
            // select: '-isActive -isDeleted -updatedAt -products'
            select: 'name price _id',
          },
          {
            path: 'items.size',
            // select: '-is_deleted -is_active -createdAt'
            select: 'name price _id',
          },
        ])
        .select('-user')
        .exec();
      res.json({
        message: 'Cart successfully',
        data: cart,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  /* update Cart */
  updateCart: async (req, res) => {
    try {
      // lay id header, id product, quantity,   total
      const { _id } = req.user;
      const { quantity: newQuantity, id: idProduct, total: newTotal } = req.body;

      const getCart = await Cart.findOne({
        user: _id,
        _id: req.params.id,
      });

      if (getCart) {
        const cartItem = getCart.items.find((item) => item?._id == idProduct);

        if (cartItem) {
          if (newQuantity == 0) {
            getCart.items = getCart.items.filter((item) => item._id != idProduct);

          } else {
            cartItem.quantity = newQuantity;
            
            cartItem.total = newTotal;
          }
          await getCart.save();

        } else {
          return res.status(400).json({
            message: 'fail',
            err: 'Cart item not found',
          });
        }
      } else {
        return res.status(400).json({
          message: 'fail',
          err: 'Cart not found',
        });
      }

      // Check if all items are removed from the cart
      const hasItems = getCart.items.length > 0;

      if (!hasItems) {
        await Cart.findByIdAndRemove(getCart._id);
      }
      return res.status(200).json({
        message: 'success',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  /* delete Cart */
  deleteCart: async (req, res) => {
    try {
      const { _id } = req.user;
      const { cartItemId } = req.params;
      const deleteProducts = await Cart.deleteOne({
        user: _id,
        _id: cartItemId,
      });

      return res.json({
        message: 'delete success',
        data: deleteProducts,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
