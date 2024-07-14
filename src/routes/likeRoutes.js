const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");

router.post("/", likeController.createLike);

router.get("/", likeController.getLikes);

router.get("/:id", likeController.getLikeById);

router.patch("/:id", likeController.updateLike);

router.delete("/:id", likeController.deleteLike);

module.exports = router;
