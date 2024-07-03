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

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User could not be found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User could not be found." });
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User could not be found." });
    }

    await user.destroy();
    res.status(200).json({ message: "User sucessfully deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
