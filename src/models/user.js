module.exports = (connection, DataTypes) => {
  const UserModel = connection.define(
    "users",
    {
      google_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      profile_picture: DataTypes.STRING,
      bio: DataTypes.TEXT,
    },
    {
      timestamps: true,
    }
  );

  return UserModel;
};
