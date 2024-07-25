module.exports = (connection, DataTypes) => {
  const FollowModel = connection.define(
    "follows",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      follower_id: {
        type: DataTypes.INTEGER,
      },
      followed_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
    }
  );

  return FollowModel;
};
