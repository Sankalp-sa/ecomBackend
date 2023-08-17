import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  payment: {},
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Not processed",
    enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Cancelled",
        "Completed",
    ],
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
