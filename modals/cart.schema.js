import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bikes: [{ type: Schema.Types.ObjectId, ref: "Bike", required: true }],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
