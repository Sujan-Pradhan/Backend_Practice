const productValidation = (req, res, next) => {
  req.check("product_name", "Product name is required").notEmpty();
  req
    .check("product_price", "Product price is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Price only contains numeric value");
  req
    .check("countInStock", "Stock number is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Stock only contains numeric value");
  req
    .check("product_description", "Description is required")
    .notEmpty()
    .isLength({
      min: 20,
    })
    .withMessage("Description must be minimum of 20 characters");
  req.check("category", "Category is required").notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const showError = errors.map((err) => err.msg)[0];
    return res.status(400).json({ error: showError });
  }
  next();
};

module.exports.productValidation = productValidation;
