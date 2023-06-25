const mongoose = require("mongoose");
const ArticleSchema = mongoose.Schema({
  yazar: {
    type: String,
    required: [true, "Lütfen kullanıcı adı giriniz"],
  },
  baslik: {
    type: String,
    required: [true, "Lütfen başlık giriniz"],
  },
  icerik: {
    type: String,
    required: [true, "Lütfen içerik giriniz"],
  },
  tagler: [{ type: String, required: [true, "Lütfen tag riniz"] }],
  begeniler: [{ type: String }],
  yorumsayi: { type: String, default: 0 },
  tarih: { type: String, required: [true, "Lütfen tarih girin"] },
});
module.exports = mongoose.model("Article", ArticleSchema);
