require("dotenv").config();
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
// const httpServer = require("http").createServer(app);
// const io = require("socket.io")(httpServer, {
//   cors: { origin: "*" },
// }); SOCKETİ KALDIRDIĞIM İÇİN YORUM SATIRINA ALDIM.

app.use(express.static("senior"));

const Comments = require("./model/Comments");
//db connection
const connectDB = require("./db/connect");
//routers
const authRouter = require("./routes/auth");
const articleRouter = require("./routes/article");
const commentRouter = require("./routes/comment");
const tagRouter = require("./routes/tag");
//error handler

app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, //limit each IP to 100 requests per windowMs
//   })
// );
app.use(express.json());
app.use(helmet());
// app.use(cors());
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(xss());
// extra packages

app.get("/", (req, res) => {
  res.send("taggy api");
});

// routes
app.use("/uyeler", authRouter);
app.use("/yazilar", articleRouter);
app.use("/yorumlar", commentRouter);
app.use("/tagler", tagRouter);
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
