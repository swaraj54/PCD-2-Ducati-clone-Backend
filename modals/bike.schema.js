import mongoose, { Schema } from "mongoose";

const bikeSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availableStock: { type: Number, required: true },
  mainPhoto: { type: String, required: true },
  sidePhoto: { type: String, required: true },
  extraPhoto1: { type: String, required: true },
  extraPhoto2: { type: String, required: true },
  extraPhoto3: { type: String, required: true },
  extraPhoto4: { type: String, required: true },
  extraPhoto5: { type: String, required: true },
  extraPhoto6: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

const Bike = mongoose.model("Bike", bikeSchema);

export default Bike;
