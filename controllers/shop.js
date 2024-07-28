const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json( {
      prods: products
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    res.json(product)
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    await req.user.populate('cart.items.productId');
    const products = req.user.cart.items;
    res.json(products);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    await req.user.addToCart(product);
    res.status(200).json('success')
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  try {
    const cart = await req.user.deleteItemFromCart(productId);
    res.status(200).json('Delete');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    await req.user.populate('cart.items.productId');
    const products = req.user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      products: products
    });
    await order.save();
    await req.user.clearCart();
    res.status(200).json('Success');
  } catch (err) {
    console.error(err);
    next(err);
  }
};
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    const transformedOrders = orders.map(order => {
      return {
        _id: order._id,
        user: order.user,
        products: order.products.map(product => ({
          quantity: product.quantity,
          price: product.product.price,
          title: product.product.title
        }))
      };
    });

    res.status(200).json(transformedOrders);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
