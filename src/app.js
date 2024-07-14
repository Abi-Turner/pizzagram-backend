const express = require("express");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const likeRouter = require("./routes/likeRoutes");
const followRouter = require("./routes/followRoutes");
const commentRouter = require("./routes/commentRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/likes", likeRouter);
app.use("/follows", followRouter);
app.use("/comments", commentRouter);

module.exports = app;
