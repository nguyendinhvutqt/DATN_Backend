const Lesson = require("../models/lesson.model");
const Chapter = require("../models/chapter.model");
const User = require("../models/user.model");
const lessonService = require("../services/lessonService");
const { StatusCodes } = require("http-status-codes");

const getById = async (req, res, next) => {
  try {
    const result = await lessonService.getById(req.params.lessonId);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const addLesson = async (req, res, next) => {
  try {
    const result = await lessonService.addLesson(
      req.params.chapterId,
      req.body,
      req.file
    );
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

const learnedLession = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await lessonService.learnedLession(user, req.body);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const editLesson = async (req, res, next) => {
  try {
    const result = await lessonService.editLesson(
      req.params.lessonId,
      req.body
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const result = await lessonService.deleteLesson(req.params.lessonId);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getById,
  addLesson,
  learnedLession,
  deleteLesson,
  editLesson,
};
