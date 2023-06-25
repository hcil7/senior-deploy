const Comments = require("../model/Comments");
const Articles = require("../model/Articles");
const User = require("../model/Users");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const getComments = async (req, res) => {
  const { id } = req.params;
  const article = await Comments.find({
    ilkYorum: id,
  });
  var authors = [];

  for (let i = 0; i < article.length; i++) {
    if (article[i].yorumaYorum == true) {
      const theAuthor = await Comments.findOne({ _id: article[i].yorumid });
      console.log(theAuthor.yazar);
      authors.push(theAuthor);
    }
  }
  if (!article) {
    throw new NotFoundError(`no job found with ${jobId}`);
  }

  console.log(article);
  res.status(StatusCodes.OK).send({ article, authors });
};

const postComments = async (req, res) => {
  // req.body.yazar = req.user.userId;

  const article = await Articles.findOne({ _id: req.params.id });

  if (req.body.yorumaYorum == false) {
    req.body.yorumid = article._id;
    article.yorumsayi = Number(article.yorumsayi) + 1;
    var updated = await Articles.findByIdAndUpdate(
      { _id: req.params.id },
      article
    );
  } else {
    const comment = await Comments.findOne({ _id: req.body.yorumid });
    comment.yorumsayi = Number(comment.yorumsayi) + 1;
    var updated = await Comments.findByIdAndUpdate(
      { _id: req.body.yorumid },
      comment
    );
    req.body.yorumid = comment._id;
  }
  const commentRes = await Comments.create(req.body);
  res.status(StatusCodes.CREATED).json({ commentRes, updated });
};

const like = async (req, res) => {
  const comment = await Comments.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({ comment });
};
const inside = async (req, res) => {
  commentId = req.params.id;

  const yorumGetir = async () => {
    var allComments = [];
    var i = 0;
    const yorum = await Comments.find({ _id: commentId });
    allComments.push(yorum[0]);
    while (allComments[i].yorumaYorum) {
      const yorum2 = await Comments.find({ _id: allComments[i].yorumid });
      allComments.push(yorum2[0]);
      i += 1;
    }
    res.status(StatusCodes.OK).json({ allComments });
  };
  yorumGetir();
};
const deleteComment = async (req, res) => {
  console.log("param", req.params);
  console.log("bddy", req.user.userId);
  const user = await User.findOne({ _id: req.user.userId });
  const comment = await Comments.findOne({ _id: req.params.id });

  if (user.username == comment.yazar) {
    const deleted = await Comments.findOneAndDelete({ _id: req.params.id });
    if (comment.yorumaYorum) {
      const yorumSayi = await Comments.findOne({ _id: comment.yorumid });
      yorumSayi.yorumsayi = Number(yorumSayi.yorumsayi) - 1;
      const yorumSayiUpdate = await Comments.findOneAndUpdate(
        { _id: comment.yorumid },
        yorumSayi
      );
    } else {
      const yorumSayi = await Articles.findOne({ _id: comment.ilkYorum });
      yorumSayi.yorumsayi = Number(yorumSayi.yorumsayi) - 1;
      const yorumSayiUpdate = await Articles.findOneAndUpdate(
        { _id: comment.ilkYorum },
        yorumSayi
      );
    }
    res.status(StatusCodes.OK).json({ deleted });
  } else {
    return res.status(StatusCodes.OK).json({ msg: "İzin verilmeyen işlem." });
  }
};
module.exports = { getComments, postComments, like, inside, deleteComment };
