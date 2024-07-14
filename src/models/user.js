module.exports = (connection, DataTypes) => {
  const UserModel = connection.define(
    "users",

    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
