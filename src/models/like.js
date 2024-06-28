module.exports = (connection, DataTypes) => {
  const schema = {};

  const LikeModel = connection.define("Like", schema);
  return LikeModel;
};
