const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const ApiError = require("../ultils/ApiError");
const User = require("../models/user.model.js");
const { generalAccessToken, generalRefreshToken } = require("./jwtService");

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token không hợp lệ");
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    const user = await User.findOne({ _id: decoded.userId });

    const newAccessToken = await generalAccessToken({
      userId: decoded.userId,
      name: decoded.name,
      roles: decoded.roles,
      avatar: decoded.avatar,
    });

    const newRefreshToken = await generalRefreshToken({
      userId: decoded.userId,
      name: decoded.name,
      roles: decoded.roles,
      avatar: decoded.avatar,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw error;
  }
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

module.exports = { refreshToken, verifyToken };
