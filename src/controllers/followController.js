const helpers = require("../utils/controllerHelper");
const { createItem, getAllItems, getItemById, updateItem, deleteItem } =
  helpers;

exports.createFollow = (req, res) => createItem(res, "follow", req.body);
exports.getAllFollows = (req, res) => getAllItems(res, "follow");
exports.getFollowById = (req, res) => getItemById(res, "follow", req.params.id);
exports.updateFollow = (req, res) =>
  updateItem(res, "follow", req.params.id, req.body);
exports.deleteFollow = (req, res) => deleteItem(res, "follow", req.params.id);
