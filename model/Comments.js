const mongoose = require("mongoose");
const CommentsSchema = mongoose.Schema({
  ilkYorum: {
    type: mongoose.Types.ObjectId,
    ref: "Article",
    required: [true, "ilk yorum girin"],
  },
  yorumid: {
    type: mongoose.Types.ObjectId,
    ref: "Comment",
    required: [true, "yorum id girin"],
  },
  yorumidYazar: { type: String, required: [true, "yorum id yazar girin"] },
  yazar: {
    type: String,
    required: [true, "yorum yazar girin"],
  },
  cevap: {
    type: String,
    required: [true, "yorum cevap girin"],
  },
  tarih: {
    type: String,
    required: [true, "yorum tarih girin"],
  },
  begeniler: [{ type: String }],
  yorumsayi: { type: Number, default: 0 },
  yorumaYorum: { type: Boolean, required: [true, "yoruma yorum mu?"] },
});

module.exports = mongoose.model("Comment", CommentsSchema);
