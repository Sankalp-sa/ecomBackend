import mongoose from "mongoose";

const discountSchema = mongoose.Schema({
    
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    discount: {
        type: Number,
        required: true
    },

}, {timestamps: true})

export default mongoose.model('Discount', discountSchema);