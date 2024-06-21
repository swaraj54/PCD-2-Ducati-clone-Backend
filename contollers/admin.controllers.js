import Bike from "../modals/bike.schema.js";
import Order from "../modals/order.schema.js";

export const addBike = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      availableStock,
      mainPhoto,
      sidePhoto,
      extraPhoto1,
      extraPhoto2,
      extraPhoto3,
      extraPhoto4,
      extraPhoto5,
      extraPhoto6,
      userId,
    } = req.body;
    if (
      !userId ||
      !name ||
      !description ||
      !price ||
      !availableStock ||
      !mainPhoto ||
      !sidePhoto ||
      !extraPhoto1 ||
      !extraPhoto2 ||
      !extraPhoto3 ||
      !extraPhoto4 ||
      !extraPhoto5 ||
      !extraPhoto6
    ) {
      return res
        .status(404)
        .json({ success: false, error: "All fields are required." });
    }

    const isBikeExist = await Bike.findOne({ name });
    if (isBikeExist) {
      return res
        .status(404)
        .json({ success: false, error: "Bike already exist." });
    }

    const newBike = new Bike({
      name,
      description,
      price,
      availableStock,
      mainPhoto,
      sidePhoto,
      extraPhoto1,
      extraPhoto2,
      extraPhoto3,
      extraPhoto4,
      extraPhoto5,
      extraPhoto6,
      admin: userId,
    });
    await newBike.save();

    return res
      .status(201)
      .json({ success: true, message: "Bike successfully added." });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const editBike = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      availableStock,
      mainPhoto,
      sidePhoto,
      extraPhoto1,
      extraPhoto2,
      extraPhoto3,
      extraPhoto4,
      extraPhoto5,
      extraPhoto6,
      userId,
      bikeId,
    } = req.body;
    if (!userId || !bikeId) {
      return res
        .status(404)
        .json({ success: false, error: "All fields are required." });
    }
    const updatedBikeData = await Bike.findByIdAndUpdate(bikeId, {
      name,
      description,
      price,
      availableStock,
      mainPhoto,
      sidePhoto,
      extraPhoto1,
      extraPhoto2,
      extraPhoto3,
      extraPhoto4,
      extraPhoto5,
      extraPhoto6,
    });

    return res
      .status(200)
      .json({ success: true, message: "Bike successfully updated." });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const deleteBike = async (req, res) => {
  try {
    const { userId, bikeId } = req.body;
    if (!userId || !bikeId) {
      return res
        .status(404)
        .json({ success: false, error: "All fields are required." });
    }
    const deletedBike = await Bike.findByIdAndUpdate(bikeId, {
      isActive: false,
    });
    return res
      .status(200)
      .json({ success: true, message: "Bike successfully deactivated." });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const getOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({}).populate("user purchasedbikes");
    return res.status(200).json({
      success: true,
      message: "All orders successfully fetched.",
      allOrders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};
