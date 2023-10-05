const User = require("../models/user.model");
const Course = require("../models/course.model");
const bcrypt = require("bcrypt");
const {
  generalAccessToken,
  generalRefreshToken,
} = require("../middlewares/auth");

const register = async (req, res) => {
  try {
    console.log("body: ", req.body);
    const { username, password, confirmPassword, name } = req.body;
    if (!username || !password || !confirmPassword || !name) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Thông tin không được để trống" });
    }
    console.log("object");
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Tên đăng nhập đã tồn tại" });
    }
    console.log("1");
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Hai mật khẩu không khớp" });
    }
    console.log("2");
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    console.log("3");
    const newUser = new User({
      ...req.body,
      password: hashPassword,
    });
    console.log("new user: ", newUser);
    console.log("4");
    await newUser.save();
    console.log("5");
    return res.status(200).json({
      status: "OK",
      message: "Đăng kí tài khoản thành công",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "ERR", message: "Lỗi server: ", error });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Thông tin không được để trống" });
    }
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user?.password)) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Thông tin không chính xác" });
    }

    const infoUser = {
      userId: user._id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };

    const accessToken = await generalAccessToken(infoUser);
    const refreshToken = await generalRefreshToken(infoUser);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      status: "OK",
      message: "Đăng nhập thành công",
      data: { accessToken, refreshToken, user: infoUser },
    });
  } catch (error) {
    return res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

// Controller để lấy danh sách khoá học mà người dùng đã tham gia
const getCoursesByUserId = async (req, res) => {
  try {
    // Lấy ID của người dùng từ request hoặc thông qua session (nếu đã đăng nhập)
    const userId = req.params.id;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "Người dùng không tồn tại",
      });
    }

    // Truy vấn danh sách khoá học mà người dùng đã tham gia
    const courses = await Course.find({ students: userId }).populate({
      path: "chapters",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    });

    return res.status(200).json({
      status: "OK",
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi server",
    });
  }
};

module.exports = {
  login,
  register,
  getCoursesByUserId,
};
