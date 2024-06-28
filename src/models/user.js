module.exports = (connection, DataTypes) => {
  const schema = {
    google_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    profile_picture: DataTypes.STRING,
    bio: DataTypes.TEXT,
  };

  const UserModel = connection.define("User", schema);

  return UserModel;
};
