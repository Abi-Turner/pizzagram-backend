const express = require("express");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const likeRouter = require("./routes/likeRoutes");
const followRouter = require("./routes/followRoutes");
const commentRouter = require("./routes/commentRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/likes", likeRouter);
app.use("/follows", followRouter);
app.use("/comments", commentRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).send("Started correctly.");
});

module.exports = app;
