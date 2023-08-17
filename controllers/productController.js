import productModel from "../modules/productModel.js";
import slugify from "slugify";
import fs from "fs";

// payment gateway :
import braintree from "braintree";
import orderModel from "../modules/orderModel.js";
import dotenv from "dotenv";
import discountModel from "../modules/discountModel.js";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Create Product

export const createProductController = async (req, res) => {
  try {
    console.log(req.fields);
    console.log(req.files);
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({
          success: false,
          message: "Name is required",
        });
      case !description:
        return res.status(500).send({
          success: false,
          message: "Description is required",
        });
      case !price:
        return res.status(500).send({
          success: false,
          message: "Price is required",
        });
      case !category:
        return res.status(500).send({
          success: false,
          message: "Category is required",
        });
      case !quantity:
        return res.status(500).send({
          success: false,
          message: "Quantity is required",
        });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          success: false,
          message: "Image should be less than 1MB",
        });
    }

    const newProduct = new productModel({
      ...req.fields,
      slug: slugify(name),
      ...req.files,
    });

    if (photo) {
      newProduct.photo.data = fs.readFileSync(photo.path);
      newProduct.photo.contentType = photo.type;
    }

    await newProduct.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in creating product",
      });
    }
  }
};

// Get all products controller

export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All products",
      total: products.length,
      products,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in getting products",
      });
    }
  }
};

// get single product controller

export const getSingleProductsController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel
      .findOne({ slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product",
      product,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in getting single product",
      });
    }
  }
};

// get product photo controller

export const getProductPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findById(pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.send(product.photo.data);
    }
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in getting product photo",
      });
    }
  }
};

// delete product controller

export const deleteProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    console.log(pid);
    const product = await productModel.findByIdAndDelete(pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error,
    });
  }
};

// update product controller
export const UpdateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({
          success: false,
          message: "Name is required",
        });
      case !description:
        return res.status(500).send({
          success: false,
          message: "Description is required",
        });
      case !price:
        return res.status(500).send({
          success: false,
          message: "Price is required",
        });
      case !category:
        return res.status(500).send({
          success: false,
          message: "Category is required",
        });
      case !quantity:
        return res.status(500).send({
          success: false,
          message: "Quantity is required",
        });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          success: false,
          message: "Image should be less than 1MB",
        });
    }

    const newProduct = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name), ...req.files },
      { new: true }
    );

    if (photo) {
      newProduct.photo.data = fs.readFileSync(photo.path);
      newProduct.photo.contentType = photo.type;
    }

    await newProduct.save();
    res.status(201).send({
      success: true,
      message: "Product Updated successfully",
      product: newProduct,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Update product",
      });
    }
  }
};

// product cnt controller

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();

    res.status(200).send({
      success: true,
      message: "Total product count",
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product count",
    });
  }
};

// product page controller

export const productPageController = async (req, res) => {
  try {
    const { checked, radio, keyword } = req.body;

    let arg = {};

    console.log("checked " + checked);
    console.log("radio" + radio);

    if (checked.length > 0) {
      arg.category = checked;
    }

    if (radio.length > 0) {
      arg.price = {
        $gte: radio[0],
        $lte: radio[1],
      };
    }

    console.log(keyword);

    if (keyword.length > 0) {
      arg.$or = [
        {
          name: { $regex: keyword, $options: "i" },
          description: { $regex: keyword, $options: "i" },
        },
      ];
    }

    const PAGE_SIZE = 3;
    const pageNumber = req.params.page ? req.params.page : 1;

    const skipAmount = (pageNumber - 1) * PAGE_SIZE;

    const products = await productModel
      .find(arg)
      .select("-photo")
      .populate("category")
      .skip(skipAmount)
      .limit(PAGE_SIZE)
      .sort({ createdAt: -1 });

    console.log(products);

    res.status(200).send({
      success: true,
      message: "Product page",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product page",
    });
  }
};

// search product controller

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const products = await productModel
      .find({
        $or: [
          {
            name: { $regex: keyword, $options: "i" },
            description: { $regex: keyword, $options: "i" },
          },
        ],
      })
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Search product",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in searching product",
      error,
    });
  }
};

// product filter controller

export const productFilterController = async (req, res) => {
  try {
    const { checked, radio, keyword } = req.body;

    let arg = {};

    if (checked.length > 0) {
      arg.category = checked;
    }

    if (radio.length) {
      arg.price = {
        $gte: radio[0],
        $lte: radio[1],
      };
    }

    const products = await productModel
      .find(arg)
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Filter product",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in filtering product",
      error,
    });
  }
};

// Similar product controller

export const similarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await productModel
      .find({ _id: { $ne: pid }, category: cid })
      .select("-photo")
      .populate("category")
      .limit(3);

    res.status(200).send({
      success: true,
      message: "Similar product",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting similar product",
      error,
    });
  }
};

// Brain tree token controller

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error in getting braintree token",
          error: err,
        });
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting braintree token",
      error,
    });
  }
};

// payment

export const paymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => (total += i.price));

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Add discount controller

export const addDiscountController = async (req, res) => {

  const {pid} = req.params;

  const {discount} = req.body;

  try{

    const discountProduct = new discountModel({
      product: pid,
      discount
    }).save();

    res.status(201).send({
      success: true,
      message: "Discount added successfully",
      discountProduct
    })

  }
  catch{
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in adding discount",
      error,
    });
  }
}

// get all discount product controller

export const getAllDiscountProductController = async (req, res) => {

  try{

    const discountProduct = await discountModel.find({}).populate('product').populate("product.category");

    res.status(200).send({
      success: true,
      message: "All discount product",
      discountProduct
    })

  }
  catch{
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting discount product",
      error,
    });
  }
}