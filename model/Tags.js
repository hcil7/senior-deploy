const mongoose = require("mongoose");
const TagSchema = mongoose.Schema({
  tag: { type: String, unique: true },
  inArticle: { type: Number, default: 1 },
});

module.exports = mongoose.model("Tag", TagSchema);
