const express = require("express");
const router = express.Router();
const {
  getArticle,
  postArticle,
  getRelevantArticles,
  getSaved,
  like,
  getPopuler,
  getByTag,
  getHareketler,
  deleteArticle,
} = require("../controller/article");
const authenticateUser = require("../middleware/authentication");

router.route("/saved").get(authenticateUser, getSaved);
router.route("/like").put(authenticateUser, like);
router.route("/populer").get(getPopuler);
router.route("/hareketler").get(authenticateUser, getHareketler);
router.route("/tag/:name").get(getByTag);
router.route("/delete/:id").delete(authenticateUser, deleteArticle);
router.route("/:id").get(getArticle);
router.route("/").post(authenticateUser, postArticle);
router.route("/").get(authenticateUser, getRelevantArticles);

module.exports = router;
