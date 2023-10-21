const { StatusCodes } = require("http-status-codes");
const searchService = require("../services/searchService");

const search = async (req, res, next) => {
  const { q, type } = req.query;
  try {
    const result = await searchService.searchService(q, type);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  search,
};
