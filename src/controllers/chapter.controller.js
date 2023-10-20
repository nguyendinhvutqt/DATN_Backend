const { StatusCodes } = require("http-status-codes");
const chapterService = require("../services/chapterService");

const addChapter = async (req, res, next) => {
  try {
    const result = await chapterService.createChapter(
      req.params.courseId,
      req.body.title
    );
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteChapter = async (req, res, next) => {
  try {
    const result = await chapterService.deleteChapter(req.params.chapterId);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const editChapter = async (req, res, next) => {
  try {
    const result = await chapterService.editChapter(
      req.params.chapterId,
      req.body.title
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addChapter,
  deleteChapter,
  editChapter,
};
