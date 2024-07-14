const helpers = require("../utils/controllerHelper");
const { createItem, getAllItems, getItemById, updateItem, deleteItem } =
  helpers;

exports.createLike = (req, res) => createItem(res, "like", req.body);
exports.getLikes = (req, res) => getAllItems(res, "like");
exports.getLikeById = (req, res) => getItemById(res, "like", req.params.id);
exports.updateLike = (req, res) =>
  updateItem(res, "like", req.params.id, req.body);
exports.deleteLike = (req, res) => deleteItem(res, "like", req.params.id);
