const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const ApiError = require("../ultils/ApiError");
const jwt = require("jsonwebtoken");

const ROLES = {
  User: "user",
  Admin: "admin",
};

const authUserMiddleware = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Token không hợp lệ" });
  }
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Xác thục người dùng thất bại" });
      }
      if (
        !decoded.roles.includes(ROLES.User) ||
        !decoded.roles.includes(ROLES.Admin)
      ) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Xác thục người dùng thất bại" });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Xác thục người dùng thất bại" });
  }
};

const authAdminMiddleware = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Token không hợp lệ" });
  }
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Xác thục người dùng thất bại" });
      }
      if (!decoded.roles.includes(ROLES.Admin)) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Xác thục người dùng thất bại" });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Xác thục người dùng thất bại" });
  }
};

module.exports = {
  authUserMiddleware,
  authAdminMiddleware,
};
