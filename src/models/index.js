const Sequelize = require("sequelize");
const UserModel = require("../models/user");
const LikeModel = require("../models/like");
const PostModel = require("../models/post");
const CommentModel = require("../models/comment");
const FollowModel = require("../models/follow");

const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env;

const setupDatabase = () => {
  const connection = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: PGPORT,
    dialect: "postgres",
    logging: false,
  });

  const User = UserModel(connection, Sequelize);
  const Like = LikeModel(connection, Sequelize);
  const Post = PostModel(connection, Sequelize);
  const Comment = CommentModel(connection, Sequelize);
  const Follow = FollowModel(connection, Sequelize);

  User.hasMany(Post, { foreignKey: "user_id" });
  User.hasMany(Comment, { foreignKey: "user_id" });
  User.hasMany(Like, { foreignKey: "user_id" });
  User.hasMany(Follow, { foreignKey: "follower_id", as: "Followings" });
  User.hasMany(Follow, { foreignKey: "followed_id", as: "Followers" });

  Post.belongsTo(User, { foreignKey: "user_id" });
  Post.hasMany(Comment, { foreignKey: "post_id" });
  Post.hasMany(Like, { foreignKey: "post_id" });

  Comment.belongsTo(User, { foreignKey: "user_id" });
  Comment.belongsTo(Post, { foreignKey: "post_id" });

  Like.belongsTo(User, { foreignKey: "user_id" });
  Like.belongsTo(Post, { foreignKey: "post_id" });

  Follow.belongsTo(User, { foreignKey: "follower_id", as: "Follower" });
  Follow.belongsTo(User, { foreignKey: "followed_id", as: "Followed" });

  connection.sync({ alter: true });

  return {
    User,
    Like,
    Post,
    Comment,
    Follow,
  };
};

module.exports = setupDatabase();
