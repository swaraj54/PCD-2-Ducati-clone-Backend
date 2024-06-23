import User from "../modals/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../modals/admin.schema.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(404)
        .json({ success: false, error: "All fields are required." });
    }

    const isEmailExist = await User.find({ email: email });
    if (isEmailExist.length) {
      return res.status(404).json({
        success: false,
        error: "Email is taken, please use differnet email.",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: encryptedPassword });
    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Registeration Completed.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(404)
        .json({ success: false, error: "All fields are required." });
    }

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      return res.status(404).json({
        success: false,
        error: "User not found, please check credentials.",
      });
    }

    const isPasswordCorret = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordCorret) {
      return res.status(404).json({
        success: false,
        error: "User not found, please check credentials.",
      });
    }

    const token = await jwt.sign(
      { userId: isUserExist._id },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "Login succcessfull.",
      token: token, // store it in ls / cookie
      userData: {
        name: isUserExist.name,
        email: isUserExist.email,
        role: "user",
        id: isUserExist._id,
      }, // store it in context
    });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res
        .status(404)
        .json({ success: false, error: "All fields are required." });
    }
    const isAdminExist = await Admin.findOne({ email });
    if (!isAdminExist) {
      // register with only postman or thunder client
      const encryuptedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ name, email, password: encryuptedPassword });
      await newAdmin.save();
      const token = await jwt.sign(
        { userId: newAdmin._id },
        process.env.JWT_SECRET
      );
      return res.status(201).json({
        success: true,
        message: "New admin registered.",
        token: token,
        userData: { name: name, email, role: "admin" },
      });
    } else {
      const isPasswordCorret = await bcrypt.compare(
        password,
        isAdminExist.password
      );
      if (!isPasswordCorret) {
        return res
          .status(404)
          .json({ success: false, error: "Password is incorrect." });
      }
      const token = await jwt.sign(
        { userId: isAdminExist._id },
        process.env.JWT_SECRET
      );
      return res.status(201).json({
        success: true,
        message: "Login Successfull.",
        token: token,
        userData: {
          name: isAdminExist.name,
          email: isAdminExist.email,
          role: "admin",
          id: isAdminExist._id,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(404)
        .json({ success: false, error: "Token not found." });
    }

    const data = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(data, "data");

    const isUserExist = await User.findById(data.userId);
    if (isUserExist) {
      return res.status(200).json({
        success: true,
        userData: {
          name: isUserExist.name,
          email: isUserExist.email,
          role: "user",
          id: isUserExist._id,
        },
      });
    } else {
      const isAdminExist = await Admin.findById(data.userId);
      if (isAdminExist) {
        return res.status(200).json({
          success: true,
          userData: {
            name: isAdminExist.name,
            email: isAdminExist.email,
            role: "admin",
            id: isAdminExist._id,
          },
        });
      } else {
        return res.status(404).json({
          success: false,
          error: "User not found, please login again.",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};
