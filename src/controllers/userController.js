const helpers = require("../utils/controllerHelper");
const { createItem, getAllItems, getItemById, updateItem, deleteItem } =
  helpers;

exports.createUser = (req, res) => createItem(res, "user", req.body);
exports.getUsers = (req, res) => getAllItems(res, "user");
exports.getUserById = (req, res) => getItemById(res, "user", req.params.id);
exports.updateUser = (req, res) =>
  updateItem(res, "user", req.params.id, req.body);
exports.deleteUser = (req, res) => deleteItem(res, "user", req.params.id);
