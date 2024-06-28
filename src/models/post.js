module.exports = (connection, DataTypes) => {
  const schema = {
    image_url: DataTypes.STRING,
    caption: DataTypes.TEXT,
  };

  const PostModel = connection.define("Post", schema);
  return PostModel;
};
