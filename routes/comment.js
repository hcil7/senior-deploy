const express = require("express");
const router = express.Router();
const {
  getComments,
  postComments,
  like,
  inside,
  deleteComment,
} = require("../controller/comment");
const authenticateUser = require("../middleware/authentication");

router.route("/like").put(authenticateUser, like);
router.route("/delete/:id").delete(authenticateUser, deleteComment);
router.route("/inside/:id").get(inside);
router.route("/:id").get(getComments);
router.route("/:id").post(authenticateUser, postComments);

module.exports = router;
