module.exports = (connection, DataTypes) => {
  const schema = {};

  const FollwModel = connection.define("Follow", schema);
  return FollowModel;
};
