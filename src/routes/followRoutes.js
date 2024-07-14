const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");

router.post("/", followController.createFollow);

router.get("/", followController.getAllFollows);

router.get("/:id", followController.getFollowById);

router.delete("/:id", followController.deleteFollow);

module.exports = router;
