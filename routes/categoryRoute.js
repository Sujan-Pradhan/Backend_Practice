const {
  postCategory,
  listCategory,
  detailCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = require("express").Router();
// const router = express.Router();

router.post("/postcategory", postCategory);
router.get("/listcategory", listCategory);
router.get("/detailcategory/:id", detailCategory);
router.put("/updatecategory/:id", updateCategory);
router.delete("/deletecategory/:id", deleteCategory);

module.exports = router;
