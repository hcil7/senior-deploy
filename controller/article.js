const Articles = require("../model/Articles");
const User = require("../model/Users");
const Tag = require("../model/Tags");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { findByIdAndUpdate, findOneAndUpdate } = require("../model/Articles");
const Comments = require("../model/Comments");

const getArticle = async (req, res) => {
  const { id } = req.params;
  const article = await Articles.findOne({
    _id: id,
  });

  if (!article) {
    throw new NotFoundError(`no job found with ${jobId}`);
  }
  res.status(StatusCodes.OK).send({ article });
};
const getRelevantArticles = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  // console.log(user);
  const articleMain = [];
  const articles = await Articles.find({
    $or: [
      { tagler: { $in: user.tagler } },
      { yazar: { $in: user.following } },
      { yazar: user.username },
    ],
  }).sort("createdAt");
  const comments = await Comments.find({
    yazar: { $in: user.following },
  }).limit(5);

  const tempObj = {};
  comments.forEach((n) => (tempObj[n.ilkYorum] = n));
  const next = Object.values(tempObj);
  console.log("unique", next);

  for (let i = 0; i < next.length; i++) {
    const commentsArticle = await Articles.findOne({
      _id: next[i].ilkYorum,
    });
    articleMain.push(commentsArticle);
  }

  res.status(StatusCodes.OK).json({ articles, next, articleMain });
};
const getSaved = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const articles = await Articles.find({ _id: { $in: user.saved } });
  res.status(StatusCodes.OK).json({ articles });
};

const postArticle = async (req, res) => {
  // req.body.yazar = req.user.userId;
  console.log("usr:", req.user.userId);
  const article = await Articles.create(req.body);
  for (let i = 0; i < req.body.tagler.length; i++) {
    const isTagExist = await Tag.findOne({ tag: req.body.tagler[i] });
    if (isTagExist != null) {
      console.log("nullum");
      isTagExist.inArticle = Number(isTagExist.inArticle) + 1;
      const updateTagNumber = await Tag.findOneAndUpdate(
        {
          tag: req.body.tagler[i],
        },
        isTagExist
      );
    } else {
      console.log("çalıştım");
      const createTag = await Tag.create({ tag: req.body.tagler[i] });
    }
  }
  res.status(StatusCodes.CREATED).json({ article });
};
const like = async (req, res) => {
  const article = await Articles.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({ article });
};
const getPopuler = async (req, res) => {
  const articles = await Articles.find({}).sort({ begeniler: -1 }).limit(50);
  console.log(articles);
  res.status(StatusCodes.OK).json({ articles });
};
const getByTag = async (req, res) => {
  const articles = await Articles.find({ tagler: req.params.name }).sort({
    tarih: -1,
  });
  res.status(StatusCodes.OK).json({ articles });
};
const getHareketler = async (req, res) => {
  console.log("user", req.user.userId);
  const user = await User.findOne({ _id: req.user.userId });
  const userArticle = await Articles.find({ yazar: user.username });
  const userComment = await Comments.find({ yazar: user.username });
  const followingArticle = await Articles.find({
    yazar: { $in: user.following },
  });
  const followingComment = await Comments.find({
    yazar: { $in: user.following },
  }).limit(20);
  res
    .status(StatusCodes.OK)
    .json({ userArticle, userComment, followingArticle, followingComment });
};
const deleteArticle = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const article = await Articles.findOne({ _id: req.params.id });
  if (user.username == article.yazar) {
    const deleted = await Articles.findOneAndDelete({ _id: req.params.id });
    for (let i = 0; i < article.tagler.length; i++) {
      const tag = await Tag.findOne({ tag: article.tagler[i] });
      tag.inArticle = Number(tag.inArticle) - 1;
      const tagUpdated = await Tag.findOneAndUpdate(
        {
          tag: article.tagler[i],
        },
        tag
      );
    }
    res.status(StatusCodes.OK).json({ deleted });
  } else {
    return res.status(StatusCodes.OK).json({ msg: "İzin verilmeyen işlem." });
  }
};
module.exports = {
  getArticle,
  postArticle,
  getRelevantArticles,
  getSaved,
  like,
  getPopuler,
  getByTag,
  getHareketler,
  deleteArticle,
};
