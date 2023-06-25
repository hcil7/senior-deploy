const Tag = require("../model/Tags");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const getPopulerTagler = async (req, res) => {
  const tagler = await Tag.find({}).sort({ inArticle: -1 }).limit(25);
  console.log("tags:", tagler);
  res.status(StatusCodes.OK).json({ tagler });
};

module.exports = {
  getPopulerTagler,
};
