import Admin from "../modals/admin.schema.js";

export const isUserAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(404)
        .json({ success: false, error: "User Id is required." });
    }
    const isAdminExist = await Admin.findById(userId);
    if (!isAdminExist) {
      return res.status(404).json({
        success: false,
        error: "You dont have access for this function.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};
