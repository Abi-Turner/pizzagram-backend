const { expect } = require("chai");
const request = require("supertest");
const { Comment, Post, User } = require("../src/models");
const app = require("../src/app");

describe("/comments", () => {
  let user;
  let posts;

  before(async () => {
    await User.sequelize.sync({ force: true });
    await Post.sequelize.sync({ force: true });
    await Comment.sequelize.sync({ force: true });

    user = await User.create({
      google_id: "some_id_5678",
      profile_picture: "https://example.com/profile.jpg",
      bio: "some bio text",
    });

    posts = await Promise.all([
      Post.create({
        user_id: user.id,
        image_url: "https://example.com/image1.jpg",
        caption: "First test caption.",
      }),
      Post.create({
        user_id: user.id,
        image_url: "https://example.com/image2.jpg",
        caption: "Second test caption.",
      }),
    ]);
  });

  beforeEach(async () => {
    await Comment.destroy({ where: {} });
  });

  describe("POST /comments", () => {
    it("creates a new comment for a post", async () => {
      const response = await request(app).post("/comments").send({
        user_id: user.id,
        post_id: posts[0].id,
        content: "This is a test comment",
      });

      expect(response.status).to.equal(201);
      expect(response.body.user_id).to.equal(user.id);
      expect(response.body.post_id).to.equal(posts[0].id);
      expect(response.body.content).to.equal("This is a test comment");

      const newCommentRecord = await Comment.findByPk(response.body.id, {
        raw: true,
      });

      expect(newCommentRecord).to.exist;
      expect(newCommentRecord.user_id).to.equal(user.id);
      expect(newCommentRecord.post_id).to.equal(posts[0].id);
      expect(newCommentRecord.content).to.equal("This is a test comment");
    });
  });

  describe("GET /comments", () => {
    it("gets all comment records", async () => {
      await Comment.bulkCreate([
        {
          user_id: user.id,
          post_id: posts[0].id,
          content: "First test comment",
        },
        {
          user_id: user.id,
          post_id: posts[1].id,
          content: "Second test comment",
        },
      ]);

      const response = await request(app).get("/comments");

      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(2);

      response.body.forEach((comment) => {
        const expected =
          comment.post_id === posts[0].id
            ? "First test comment"
            : "Second test comment";

        expect(comment.user_id).to.equal(user.id);
        expect(comment.content).to.equal(expected);
      });
    });
  });

  describe("GET /comments/:id", () => {
    it("gets comment records by id", async () => {
      const comment = await Comment.create({
        user_id: user.id,
        post_id: posts[0].id,
        content: "This is a test comment",
      });

      const response = await request(app).get(`/comments/${comment.id}`);

      expect(response.status).to.equal(200);
      expect(response.body.user_id).to.equal(user.id);
      expect(response.body.post_id).to.equal(posts[0].id);
      expect(response.body.content).to.equal("This is a test comment");
    });

    it("returns 404 status if comment does not exist", async () => {
      const response = await request(app).get("/comments/12345");

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("comment could not be found.");
    });
  });

  describe("PATCH /comments/:id", () => {
    it("updates comment content by id", async () => {
      const comment = await Comment.create({
        user_id: user.id,
        post_id: posts[0].id,
        content: "Original content",
      });

      console.log(`Created comment: ${JSON.stringify(comment)}`);

      const response = await request(app)
        .patch(`/comments/${comment.id}`)
        .send({
          content: "Updated content",
        });

      console.log(`Response: ${JSON.stringify(response.body)}`);

      expect(response.status).to.equal(200);
      expect(response.body.content).to.equal("Updated content");

      const updatedCommentRecord = await Comment.findByPk(comment.id, {
        raw: true,
      });

      console.log(`Updated comment: ${JSON.stringify(updatedCommentRecord)}`);

      expect(updatedCommentRecord.content).to.equal("Updated content");
    });

    it("returns 404 if the comment does not exist", async () => {
      const response = await request(app).patch("/comments/1234567").send({
        content: "This is the updated content!",
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("comment could not be found.");
    });
  });

  describe("DELETE /comments/:id", () => {
    it("deletes comment record by id", async () => {
      const comment = await Comment.create({
        user_id: user.id,
        post_id: posts[0].id,
        content: "This is a test comment",
      });

      const response = await request(app).delete(`/comments/${comment.id}`);
      const deletedComment = await Comment.findByPk(comment.id);

      expect(response.status).to.equal(200);
      expect(deletedComment).to.equal(null);
    });

    it("returns 404 if the comment does not exist", async () => {
      const response = await request(app).delete("/comments/12345");
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("comment could not be found.");
    });
  });
});
