const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../ultils/ApiError");

const createCourse = async (req, res, next) => {
  const correntCondition = Joi.object({
    file: Joi.any(),
    title: Joi.string().required().min(3).trim().strict().messages({
      "any.required": "Tiêu đề không được để trống",
      "string.empty": "Tiêu đề không được để trống",
      "string.min": "Tiêu đề phải lớn hơn 3 kí tự",
    }),
    description: Joi.string().required().min(3).trim().strict().messages({
      "any.required": "Mô tả không được để trống",
      "string.empty": "Mô tả không được để trống",
      "string.min": "Mô tả phải lớn hơn 3 kí tự",
    }),
  });

  try {
    await correntCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const editCourse = async (req, res, next) => {
  const correntCondition = Joi.object({
    title: Joi.string().min(3).trim().strict().messages({
      "string.empty": "Tiêu đề không được để trống",
      "string.min": "Tiêu đề phải lớn hơn 3 kí tự",
    }),
    description: Joi.string().min(3).trim().strict().messages({
      "string.empty": "Mô tả không được để trống",
      "string.min": "Mô tả phải lớn hơn 3 kí tự",
    }),
  });

  try {
    await correntCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

module.exports = {
  createCourse,
  editCourse,
};
