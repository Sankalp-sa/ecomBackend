import categoryModel from "../modules/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(401).send({
        success: false,
        message: "Name is required",
      });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }

    const category = new categoryModel({
      name,
      slug: slugify(name),
    });

    category.save();

    res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in category creation",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in category update",
    });
  }
};

// categoryController

export const categoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});

    res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error: error.message,
        message: "Error in category fetching",
      });
    }
  }
};

// SingleCategoryController

export const SingleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });

    res.status(200).send({
      success: true,
      message: "Single Category fetched successfully",
      category,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error: error.message,
        message: "Error in single category fetching",
      });
    }
  }
};

// Delete category

export const deleteCategoryController = async (req, res) => {

    try {
        const id = req.params.id;
        const category = await categoryModel.findByIdAndDelete(id);
    
        res.status(200).send({
        success: true,
        message: "Category deleted successfully",
        category,
        });
    } catch (error) {
        if (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in category deletion",
        });
        }
    }
}