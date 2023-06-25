const express = require("express");
const router = express.Router();

const {
  login,
  register,
  token,
  getProfil,
  save,
  removeSaved,
  takipTag,
  takipEdilenTag,
  takip,
  takipEdilen,
} = require("../controller/auth");
const authenticateUser = require("../middleware/authentication");
router.post("/register", register);
router.post("/login", login);
router.post("/token", token);
router.put("/save", authenticateUser, save);
router.put("/remove", authenticateUser, removeSaved);
router.put("/takipet", authenticateUser, takip);
router.get("/takipedilen/:user", authenticateUser, takipEdilen);
router.put("/takip", authenticateUser, takipTag);
router.get("/takiptag/:tag", authenticateUser, takipEdilenTag);
router.get("/:user", getProfil);

module.exports = router;
