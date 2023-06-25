const User = require("../model/Users");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const Articles = require("../model/Articles");
const Comments = require("../model/Comments");
const Users = require("../model/Users");

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res
      .status(StatusCodes.CREATED)
      .json({ user: { name: user.username }, token });
  } catch (error) {
    res.status(StatusCodes.OK).json({ msg: Object.keys(error.keyValue) });
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    // throw new BadRequestError("Please provide username and password");
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Kullanıcı Adı ve Şifre Giriniz" });
  }
  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Böyle Bir Kullanıcı Mevcut Değil" });
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(StatusCodes.OK).json({ msg: "Hatalı Şifre" });
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.username }, token });
};
const token = async (req, res) => {
  const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  req.user = {
    userId: decoded.userId,
  }; //sonradan eklendi
  const user = await User.find({
    _id: userId,
  });

  res.status(StatusCodes.OK).json({ user: user[0].username });
};
const getProfil = async (req, res) => {
  const { user } = req.params;
  const userResponse = await User.findOne({ username: user });
  if (!userResponse) {
    return res.status(StatusCodes.OK).json({ userResponse });
  }
  const userArticles = await Articles.find({ yazar: userResponse.username });
  const userComment = await Comments.find({ yazar: userResponse.username });
  const userLike = await Articles.find({ begeniler: userResponse.username });
  userLike.push(...(await Comments.find({ begeniler: userResponse.username })));
  res
    .status(StatusCodes.OK)
    .json({ userResponse, userArticles, userComment, userLike });
};
const save = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user.saved.includes(req.body.id)) {
    user.saved.push(req.body.id);
    const userUpdated = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      user
    );
    return res.status(StatusCodes.OK).json({ msg: "Yazı Başarıyla Eklendi" });
  } else {
    res.status(StatusCodes.OK).json({ msg: " Yazı Zaten Kaydedilmiş" });
  }
};
const removeSaved = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });

  if (user.saved.includes(req.body.id)) {
    const index = user.saved.indexOf(req.body.id);
    const updated = user.saved.splice(index, 1);
    const userUpdated = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      user
    );

    return res.status(StatusCodes.OK).json({ msg: "Yazı Kaldırıldı" });
  }
  res.status(StatusCodes.OK).json({ msg: "Yazı Bulunamadı" });
};
const takipTag = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user.tagler.includes(req.body.tag)) {
    user.tagler.push(req.body.tag);
  } else {
    for (let i = 0; i < user.tagler.length; i++) {
      if (user.tagler[i] == req.body.tag) {
        user.tagler.splice(i, 1);
      }
    }
  }
  const updated = await User.findByIdAndUpdate({ _id: req.user.userId }, user);
  res.status(StatusCodes.OK).json({ updated });
};
const takipEdilenTag = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (user.tagler.includes(req.params.tag)) {
    return res.status(StatusCodes.OK).json({ follows: true });
  } else {
    res.status(StatusCodes.OK).json({ follows: false });
  }
};

const takip = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWillBeFollowed = await User.findOne({
    username: req.body.username,
  });
  if (!user.following.includes(req.body.username)) {
    user.following.push(req.body.username);
    userWillBeFollowed.followers.push(user.username);
  } else {
    for (let i = 0; i < user.following.length; i++) {
      if (user.following[i] == req.body.username) {
        user.following.splice(i, 1);
      }
    }
    for (let i = 0; i < userWillBeFollowed.followers.length; i++) {
      if (userWillBeFollowed.followers[i] == user.username) {
        userWillBeFollowed.followers.splice(i, 1);
      }
    }
  }
  const updated = await User.findByIdAndUpdate({ _id: req.user.userId }, user);
  const updatedFollower = await User.findOneAndUpdate(
    { username: userWillBeFollowed.username },
    userWillBeFollowed
  );
  res.status(StatusCodes.OK).json({ updated });
};
const takipEdilen = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (user.following.includes(req.params.user)) {
    return res.status(StatusCodes.OK).json({ follows: true });
  } else {
    res.status(StatusCodes.OK).json({ follows: false });
  }
};
module.exports = {
  register,
  login,
  token,
  getProfil,
  save,
  removeSaved,
  takipTag,
  takipEdilenTag,
  takip,
  takipEdilen,
};
