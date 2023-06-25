const express = require("express");
const router = express.Router();
const { getPopulerTagler } = require("../controller/tag");

router.route("/populer").get(getPopulerTagler);
module.exports = router;
