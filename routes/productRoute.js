const {
  postProducts,
  listProducts,
  detailsProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const upload = require("../middleware/fileUpload");
const { productValidation } = require("../validation/validation");

const router = require("express").Router();

router.post(
  "/postproduct",
  upload.single("product_image"),
  productValidation,
  postProducts
);
router.get("/listproduct", listProducts);
router.get("/detailproduct/:id", detailsProduct);
router.put("/updateproduct/:id", productValidation, updateProduct);
router.delete("/deleteproduct/:id", deleteProduct);

module.exports = router;
