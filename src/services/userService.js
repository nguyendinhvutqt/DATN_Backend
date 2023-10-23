const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const Course = require("../models/course.model");

const ApiError = require("../ultils/ApiError");
const { generalAccessToken, generalRefreshToken } = require("./jwtService");

const STATUS_USER = {
  HOAT_DONG: "Hoạt động",
  DA_KHOA: "Đã khoá",
};

const getUsers = async (data) => {
  try {
    const { page = 1, limit = 2 } = data;
    const skip = (page - 1) * limit;

    const totalusers = await User.count();

    const totalPage = Math.floor(totalusers / limit);

    const users = await User.find({ roles: { $ne: "admin" } })
      .sort({ createdAt: "desc" })
      .limit(limit)
      .skip(skip);

    if (!users) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Danh sách rỗng");
    }
    return {
      currentPage: +page,
      totalPage: totalPage,
      data: users,
    };
  } catch (error) {
    throw error;
  }
};

const register = async (data) => {
  try {
    const { username, password, confirmPassword, name } = data;
    if (!username || !password || !confirmPassword || !name) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Thông tin không được bỏ trống"
      );
    }
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Tên đăng nhập đã tồn tại");
    }
    if (password !== confirmPassword) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Hai mật khẩu phải giống nhau"
      );
    }
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = new User({
      ...data,
      password: hashPassword,
    });
    await newUser.save();
    return { message: "Tạo tài khoản thành công" };
  } catch (error) {
    throw error;
  }
};

const login = async (data) => {
  try {
    const { username, password } = data;
    if (!username || !password) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Thông tin không được để trống"
      );
    }
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user?.password)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Thông tin không chính xác");
    }

    if (user.status === "Đã khoá") {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Tài khoản của bạn đã bị khoá"
      );
    }

    const infoUser = {
      userId: user._id,
      name: user.name,
      roles: user.roles,
      avatar: user.avatar,
    };

    const accessToken = await generalAccessToken(infoUser);
    const refreshToken = await generalRefreshToken(infoUser);

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken, user: infoUser };
  } catch (error) {
    throw error;
  }
};

const getCoursesLearned = async (userInfo) => {
  try {
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ _id: userInfo.userId });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Người dùng không tồn tại");
    }

    // Truy vấn danh sách khoá học mà người dùng đã tham gia
    const courses = await Course.find({ students: userInfo.userId }).populate({
      path: "chapters",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    });
    return { courses };
  } catch (error) {
    throw error;
  }
};

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

const blockUser = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy người dùng");
    }
    user.status = STATUS_USER.DA_KHOA;
    await user.save();
    return { data: user };
  } catch (error) {
    throw error;
  }
};

const unBlockUser = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy người dùng");
    }
    user.status = STATUS_USER.HOAT_DONG;
    await user.save();
    return { data: user };
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

module.exports = {
  getUsers,
  register,
  login,
  getCoursesLearned,
  refreshToken,
  blockUser,
  unBlockUser,
  verifyToken,
};
