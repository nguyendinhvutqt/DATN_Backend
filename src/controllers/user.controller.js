const { StatusCodes } = require("http-status-codes");

const userService = require("../services/userService");

// lấy danh sách người dùng
const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

// đăng kí người dùng
const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);

    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

// đăng nhập người dùng
const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

// Controller để lấy danh sách khoá học mà người dùng đã tham gia
const getCoursesLearned = async (req, res) => {
  try {
    const userInfo = req.user;

    const result = await userService.getCoursesLearned(userInfo);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    console.log(req.body.userId);
    const result = await userService.blockUser(req.body.userId);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const unBlockUser = async (req, res, next) => {
  try {
    console.log(req.body.userId);
    const result = await userService.unBlockUser(req.body.userId);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await userService.refreshToken(refreshToken);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  login,
  register,
  getCoursesLearned,
  blockUser,
  unBlockUser,
  refreshToken,
};
