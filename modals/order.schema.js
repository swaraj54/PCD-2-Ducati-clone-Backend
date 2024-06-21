import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paidAmount: { type: Number, required: true },
    purchasedbikes: [
      { type: Schema.Types.ObjectId, ref: "Bike", required: true },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
