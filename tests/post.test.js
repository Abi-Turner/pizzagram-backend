const { expect } = require("chai");
const request = require("supertest");
const { Post, User } = require("../src/models");
const app = require("../src/app");

describe("/posts", () => {
  let user;

  before(async () => {
    await User.sequelize.sync({ force: true });
    await Post.sequelize.sync({ force: true });

    user = await User.create({
      email: "test@example.com",
      password: "password",
      google_id: "some_id_5678",
      profile_picture: "https://example.com/profile.jpg",
      bio: "some bio text",
    });
  });

  beforeEach(async () => {
    await Post.destroy({ where: {} });
  });

  describe("with no records in database", () => {
    describe("POST /posts", () => {
      it("creates a new post in the database", async () => {
        const response = await request(app).post("/posts").send({
          user_id: user.id,
          image_url: "https://example.com/image.jpg",
          caption: "A caption for a test post",
        });

        expect(response.status).to.equal(201);
        expect(response.body.caption).to.equal("A caption for a test post");
        expect(response.body.user_id).to.equal(user.id);

        const newPostRecord = await Post.findByPk(response.body.id, {
          raw: true,
        });

        expect(newPostRecord).to.exist;
      });
    });
  });

  describe("with records in the database", () => {
    let posts;

    beforeEach(async () => {
      posts = await Promise.all([
        Post.create({
          user_id: user.id,
          image_url: "https://example.com/image.jpg",
          caption: "First caption for a test post",
        }),
        Post.create({
          user_id: user.id,
          image_url: "https://example.com/image.jpg",
          caption: "Second caption for a test post",
        }),
        Post.create({
          user_id: user.id,
          image_url: "https://example.com/image.jpg",
          caption: "A caption for a test post",
        }),
      ]);
    });

    describe("GET /posts", () => {
      it("gets all post records", async () => {
        const response = await request(app).get("/posts");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((post) => {
          const expected = posts.find((a) => a.id === post.id);

          expect(post.caption).to.equal(expected.caption);
          expect(post.user_id).to.equal(expected.user_id);
        });
      });
    });

    describe("GET /posts/:id", () => {
      it("gets post records by id", async () => {
        const post = posts[0];
        const response = await request(app).get(`/posts/${post.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.content).to.equal(post.content);
        expect(response.body.user_id).to.equal(post.user_id);
      });

      it("returns 404 status if the post does not exist", async () => {
        const response = await request(app).get("/posts/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("post could not be found.");
      });
    });

    describe("PATCH /posts/:id", () => {
      it("updates post content by id", async () => {
        const post = posts[0];
        const response = await request(app).patch(`/posts/${post.id}`).send({
          caption: "This is the updated caption!",
        });

        const updatedPostRecord = await Post.findByPk(post.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(updatedPostRecord.caption).to.equal(
          "This is the updated caption!"
        );
      });

      it("returns a 404 if the post does not exist", async () => {
        const response = await request(app).patch("/posts/1234567").send({
          content: "This is the updated content!",
        });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("post could not be found.");
      });
    });

    describe("DELETE /posts/:id", () => {
      it("deletes post record by id", async () => {
        const post = posts[0];
        const response = await request(app).delete(`/posts/${post.id}`);
        const deletedPost = await Post.findByPk(post.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(deletedPost).to.equal(null);
      });

      it("returns 404 if the post does not exist", async () => {
        const response = await request(app).delete("/posts/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("post could not be found.");
      });
    });
  });
});
