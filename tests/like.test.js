const { expect } = require("chai");
const request = require("supertest");
const { Like, Post, User } = require("../src/models");
const app = require("../src/app");

describe("/likes", () => {
  let user;
  let posts;

  before(async () => {
    await User.sequelize.sync({ force: true });
    await Post.sequelize.sync({ force: true });
    await Like.sequelize.sync({ force: true });

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
    await Like.destroy({ where: {} });
  });

  describe("POST /likes", () => {
    it("creates a new like for a post", async () => {
      const response = await request(app).post("/likes").send({
        user_id: user.id,
        post_id: posts[0].id,
      });

      expect(response.status).to.equal(201);
      expect(response.body.user_id).to.equal(user.id);
      expect(response.body.post_id).to.equal(posts[0].id);

      const newLikeRecord = await Like.findByPk(response.body.id, {
        raw: true,
      });

      expect(newLikeRecord).to.exist;
      expect(newLikeRecord.user_id).to.equal(user.id);
      expect(newLikeRecord.post_id).to.equal(posts[0].id);
    });
  });

  describe("GET /likes", () => {
    it("gets all likes records", async () => {
      await Like.bulkCreate([
        { user_id: user.id, post_id: posts[0].id },
        { user_id: user.id, post_id: posts[1].id },
      ]);

      const response = await request(app).get("/likes");

      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(2);

      response.body.forEach((like) => {
        const expected = posts.find((post) => post.id === like.post_id);

        expect(like.user_id).to.equal(user.id);
        expect(expected).to.exist;
      });
    });
  });

  describe("GET /likes/:id", () => {
    it("gets like records by id", async () => {
      const like = await Like.create({
        user_id: user.id,
        post_id: posts[0].id,
      });

      const response = await request(app).get(`/likes/${like.id}`);

      expect(response.status).to.equal(200);
      expect(response.body.user_id).to.equal(user.id);
      expect(response.body.post_id).to.equal(posts[0].id);
    });

    it("returns 404 status if like does not exist", async () => {
      const response = await request(app).get("/likes/12345");

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("like could not be found.");
    });
  });

  describe("PATCH /likes/:id", () => {
    it("unlikes a post by removing the like", async () => {
      const like = await Like.create({
        user_id: user.id,
        post_id: posts[0].id,
      });

      await Like.destroy({ where: { id: like.id } });

      const deletedLike = await Like.findByPk(like.id);
      expect(deletedLike).to.equal(null);
    });

    it("returns a 404 if the like does not exist", async () => {
      const response = await request(app).patch("/likes/1234567");

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("like could not be found.");
    });
  });

  describe("DELETE /likes/:id", () => {
    it("deletes like record by id", async () => {
      const like = await Like.create({
        user_id: user.id,
        post_id: posts[0].id,
      });

      const response = await request(app).delete(`/likes/${like.id}`);
      const deletedLike = await Like.findByPk(like.id);

      expect(response.status).to.equal(200);
      expect(deletedLike).to.equal(null);
    });

    it("returns 404 if the like does not exist", async () => {
      const response = await request(app).delete("/likes/12345");
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("like could not be found.");
    });
  });
});
