const helpers = require("../utils/controllerHelper");
const { createItem, getAllItems, getItemById, updateItem, deleteItem } =
  helpers;

exports.createComment = (req, res) => createItem(res, "comment", req.body);
exports.getComments = (req, res) => getAllItems(res, "comment");
exports.getCommentById = (req, res) =>
  getItemById(res, "comment", req.params.id);
exports.updateCommentById = (req, res) =>
  updateItem(res, "comment", req.params.id, req.body);
exports.deleteComment = (req, res) => deleteItem(res, "comment", req.params.id);
