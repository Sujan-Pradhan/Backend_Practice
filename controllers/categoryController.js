const Acategory = require("../models/categoryModel");

//post the name of category
exports.postCategory = async (req, res) => {
  let category = new Acategory({
    category_name: req.body.name,
    //category_name from model
    //name from form
  });
  category = await category.save();
  if (!category)
    return res.status(400).json({ error: "Something went wrong in posting" });
  res.send(category);
};

//list of all categories
exports.listCategory = async (req, res) => {
  let category1 = await Acategory.find();
  if (!category1)
    return res.status(400).json({ error: "Something happens bad" });
  res.send(category1);
};

//single category details
exports.detailCategory = async (req, res) => {
  let category2 = await Acategory.findById(req.params.id);
  if (!category2)
    return res.status(400).json({ error: "Something happens bad" });
  res.send(category2);
};

//update category name
exports.updateCategory = async (req, res) => {
  let category3 = await Acategory.findByIdAndUpdate(
    req.params.id,
    { category_name: req.body.name },
    { new: true }
  );
  if (!category3)
    return res.status(400).json({ error: "Something went wrong in posting" });
  res.send(category3);
};

//delete category

exports.deleteCategory = (req, res) => {
  Acategory.findByIdAndDelete(req.params.id).then((category4) => {
    if (!category4)
      return res.status(400).json({ error: "Category not found" });
    else
      return res
        .status(200)
        .json({ message: "Category Deleted" })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
  });
};
