module.exports = (connection, DataTypes) => {
  const schema = {
    content: DataTypes.TEXT,
  };

  const CommentModel = connection.define("Comment", schema);
  return CommentModel;
};
