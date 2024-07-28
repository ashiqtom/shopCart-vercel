const Product = require('../models/product');
const User = require('../models/user');

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user
  });

  try {
    await product.save();
    res.status(200).json('posted');
  } catch (err) {
    console.error(err);
    next(err); // Pass error to the error-handling middleware
  }
};

exports.getEditProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.redirect('/');
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    next(err); // Pass error to the error-handling middleware
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json('failed');
    }
    product.title = title;
    product.price = price;
    product.imageUrl = imageUrl;
    product.description = description;
    await product.save();
    res.status(200).json('success')
  } catch (err) {
    console.error(err);
    next(err); // Pass error to the error-handling middleware
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findByIdAndDelete(prodId);
    if (!product) {
      throw new Error('Product not found');
    }

    await User.updateMany(
      { 'cart.items.productId': prodId },
      { $pull: { 'cart.items': { productId: prodId } } }
    );

    res.status(200).json('Deleted');
  } catch (err) {
    console.error('Error deleting product or updating user carts:', err);
    next(err); // Pass error to the error-handling middleware
  }
};
