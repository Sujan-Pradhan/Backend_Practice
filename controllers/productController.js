const Aproduct = require("../models/productModel");

//posting products
exports.postProducts = async (req, res) => {
  //   const {
  //     product_name,
  //     product_price,
  //     countInStock,
  //     product_description,
  //     product_image,
  //     category,
  //   } = req.body;
  //   let product = new Aproduct(
  //     ({
  //       product_name,
  //       product_price,
  //       countInStock,
  //       product_description,
  //       product_image,
  //       category,
  //     } = req.body)
  //   );
  let product = new Aproduct({
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    countInStock: req.body.countInStock,
    product_description: req.body.product_description,
    product_image: req.file.path,
    category: req.body.category,
  });
  product = await product.save();
  if (!product)
    return res.status(400).json({ error: "Something went wrong!!" });
  res.send(product);
};

//list products
exports.listProducts = async (req, res) => {
  const product1 = await Aproduct.find();
  if (!product1)
    return res.status(400).json({ error: "Something went wrong!!" });
  res.send(product1);
};

//details of single products
exports.detailsProduct = async (req, res) => {
  const product2 = await Aproduct.findById(req.params.id);
  if (!product2)
    return res.status(400).json({ error: "Something went wrong!!" });
  res.send(product2);
};

exports.updateProduct = async (req, res) => {
  let product3 = await Aproduct.findByIdAndUpdate(
    req.params.id,
    ({
      product_name,
      product_price,
      countInStock,
      product_description,
      product_image,
      category,
    } = req.body),
    { new: true }
  );

  if (!product3)
    return res.status(400).json({ error: "Something went wrong!!" });
  res.send(product3);
};

//delete added products
exports.deleteProduct = (req, res) => {
  Aproduct.findByIdAndRemove(req.params.id)
    .then((product4) => {
      if (!product4) {
        return res.status(400).json({ error: "product not found" });
      } else {
        return res.status(200).json({ message: "product deleted" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};
