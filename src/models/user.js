const bcrypt = require("bcrypt");

module.exports = (connection, DataTypes) => {
  const UserModel = connection.define(
    "users",

    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_picture: DataTypes.STRING,
      bio: DataTypes.TEXT,
    },
    {
      timestamps: true,
    }
  );

  UserModel.findByLogin = async function (email, password) {
    const user = await this.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    return validPassword ? user : null;
  };

  return UserModel;
};
