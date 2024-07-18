const { User, Post, Like, Follow, Comment } = require("../models");
const get404Error = (model) => ({ error: `${model} could not be found.` });
const bcrypt = require("bcrypt");

const getModel = (model) => {
  const models = {
    user: User,
    post: Post,
    like: Like,
    follow: Follow,
    comment: Comment,
  };

  return models[model];
};

const getOptions = (model) => {
  switch (model) {
    case "user":
      return {
        include: [
          Post,
          Like,
          { model: Follow, as: "Followings" },
          { model: Follow, as: "Followers" },
          Comment,
        ],
      };
    case "post":
      return {
        include: [User, Comment],
      };
    case "like":
      return {
        include: [User, Post],
      };
    case "follow":
      return {
        include: [
          { model: User, as: "Follower" },
          { model: User, as: "Followed" },
        ],
      };
    case "comment":
      return {
        include: [User, Post],
      };
    default:
      return {};
  }
};

const createItem = async (res, model, item) => {
  const Model = getModel(model);
  try {
    if (model === "user") {
      const { email, password, profile_picture, bio } = item;
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        profile_picture,
        bio,
      });

      res.status(201).json(newUser);
    } else {
      const newItem = await Model.create(item);
      res.status(201).json(newItem);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllItems = async (res, model) => {
  const Model = getModel(model);

  try {
    const items = await Model.findAll(getOptions(model));
    res.status(200).json(items);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: error.message });
  }
};

const getItemById = async (res, model, id) => {
  const Model = getModel(model);

  try {
    const item = await Model.findByPk(id, getOptions(model));

    if (!item) {
      res.status(404).json(get404Error(model));
    } else {
      res.status(200).json(item);
    }
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateItem = async (res, model, id, item) => {
  const Model = getModel(model);

  try {
    const [itemsUpdated] = await Model.update(item, { where: { id } });

    if (!itemsUpdated) {
      res.status(404).json(get404Error(model));
    } else {
      const updatedItem = await Model.findByPk(id);
      res.status(200).json(updatedItem);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteItem = async (res, model, id) => {
  const Model = getModel(model);

  try {
    const itemsDeleted = await Model.destroy({ where: { id } });

    if (!itemsDeleted) {
      res.status(404).json(get404Error(model));
    } else {
      res.status(200).json({ message: `${model} successfully deleted.` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
