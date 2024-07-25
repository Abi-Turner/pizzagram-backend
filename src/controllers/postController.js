const helpers = require("../utils/controllerHelper");
const { createItem, getAllItems, getItemById, updateItem, deleteItem } =
  helpers;

exports.createPost = (req, res) => createItem(res, "post", req.body);
exports.getPosts = (req, res) => getAllItems(res, "post");
exports.getPostById = (req, res) => getItemById(res, "post", req.params.id);
exports.updatePost = (req, res) =>
  updateItem(res, "post", req.params.id, req.body);
exports.deletePost = (req, res) => deleteItem(res, "post", req.params.id);
