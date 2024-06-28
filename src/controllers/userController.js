const { User } = require("../models");

exports.createUser = async (req, res) => {
  try {
    const { google_id, profile_picture, bio } = req.body;
    const newUser = await User.create({ google_id, profile_picture, bio });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
