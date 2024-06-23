import Bike from "../modals/bike.schema.js";
import Cart from "../modals/cart.schema.js";
import Order from "../modals/order.schema.js";

export const allBikes = async (req, res) => {
  try {
    const allBike = await Bike.find({});
    return res
      .status(200)
      .json({ success: true, message: "All bikes fetcted.", bikes: allBike });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};
export const singleBike = async (req, res) => {
  try {
    const { bikeId } = req.body;
    if (!bikeId) {
      return res
        .status(500)
        .json({ success: false, error: "Bike id is required." });
    }
    const isBikeExist = await Bike.findById(bikeId);
    return res.status(200).json({
      success: true,
      message: "Bike data fetched successfully.",
      bikeData: isBikeExist,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId, bikeId } = req.body;
    if (!userId || !bikeId) {
      return res
        .status(500)
        .json({ success: false, error: "User and Bike required." });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, bikes: [] });
    }
    if (cart.bikes.includes(bikeId)) {
      return res
        .status(400)
        .json({ success: false, error: "Bike already exist in cart." });
    }
    cart.bikes.push(bikeId);
    await cart.save();
    return res
      .status(201)
      .json({ success: true, message: "Bike successfully added in cart." });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "User id is required." });
    }
    const cartBikes = await Cart.findOne({ user: userId }).populate("bikes");
    console.log(cartBikes, "cartBikes");
    return res.status(200).json({
      success: true,
      message: "Cart bikes successfully fetched.",
      cartBikes: cartBikes.bikes,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const buyBike = async (req, res) => {
  try {
    const { userId, bikeIds } = req.body;
    if (!userId || bikeIds.length < 1) {
      return res
        .status(400)
        .json({ success: false, error: "User and bikes are required." });
    }
    let totalAmount = 0;
    for (var i = 0; i < bikeIds.length; i++) {
      const bike = await Bike.findById(bikeIds[i]);
      if (bike) {
        totalAmount += bike.price;
      }
    }
    console.log(totalAmount, "totalAmount");
    for (var i = 0; i < bikeIds.length; i++) {
      const bike = await Bike.findById(bikeIds[i]);
      if (bike && bike.availableStock < 1) {
        return res
          .status(400)
          .json({ success: false, error: "Bike is not available." });
      }
    }

    const newOrder = new Order({
      user: userId,
      purchasedbikes: bikeIds,
      paidAmount: totalAmount,
    });
    await newOrder.save();

    for (var i = 0; i < bikeIds.length; i++) {
      const bike = await Bike.findById(bikeIds[i]);
      if (bike && bike.availableStock > 0) {
        bike.availableStock -= 1;
        await bike.save();
      }
    }

    await Cart.updateOne(
      { user: userId },
      { $pull: { bikes: { $in: bikeIds } } }
    );

    return res
      .status(200)
      .json({ success: true, message: "Order successfully created." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

export const purchaseHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({ user: userId }).populate(
      "purchasedbikes"
    );
    console.log(orders, "orders");
    return res
      .status(200)
      .json({ success: true, message: "Orders successfully fetched.", orders });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};
