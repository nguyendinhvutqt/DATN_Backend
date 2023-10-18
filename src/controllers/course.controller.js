const { StatusCodes } = require("http-status-codes");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const courseService = require("../services/courseService");

const getCoursesAndPaginate = async (req, res, next) => {
  try {
    const courses = await courseService.getCoursesAndPaginate(req.params);
    return res.status(StatusCodes.OK).json(courses);
  } catch (error) {
    next(error);
  }
};

const getCourses = async (req, res, next) => {
  console.log("req.user: ", req.user);
  try {
    const courses = await courseService.getCourses();

    return res.status(StatusCodes.OK).json(courses);
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.courseId);

    return res.status(StatusCodes.OK).json(course);
  } catch (error) {
    next(error);
  }
};

const addCourse = async (req, res, next) => {
  try {
    const newCourse = await courseService.createCourse(req.body, req.file);
    return res.status(StatusCodes.CREATED).json(newCourse);
  } catch (error) {
    return res.status(500).json({ status: "ERR", message: "Lỗi Server" });
  }
};

const editCourse = async (req, res, next) => {
  try {
    const editCourse = await courseService.editCourse(
      req.params.courseId,
      req.body,
      req.file
    );

    return res.status(StatusCodes.OK).json(editCourse);
  } catch (error) {
    next(error);
  }
};

const delCourse = async (req, res, next) => {
  try {
    const delCourse = await courseService.deleteCourse(req.params.courseId);
    return res.status(StatusCodes.OK).json(delCourse);
  } catch (error) {
    next(error);
  }
};

// Đăng kí khoá học
const registerCourse = async (req, res, next) => {
  try {
    const result = await courseService.registerCourse(req.body);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoursesAndPaginate,
  getCourses,
  getCourseById,
  addCourse,
  editCourse,
  delCourse,
  registerCourse,
};
