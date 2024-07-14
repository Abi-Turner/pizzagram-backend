const { expect } = require("chai");
const request = require("supertest");
const { Follow, User } = require("../src/models");
const app = require("../src/app");

describe("/follows", () => {
  let users;

  before(async () => {
    await User.sequelize.sync({ force: true });
    await Follow.sequelize.sync({ force: true });

    users = await Promise.all([
      User.create({
        google_id: "some_id_1234",
        profile_picture: "https://example.com/profile1.jpg",
        bio: "first bio text",
      }),
      User.create({
        google_id: "some_id_5678",
        profile_picture: "https://example.com/profile2.jpg",
        bio: "second bio text",
      }),
    ]);
  });

  beforeEach(async () => {
    await Follow.destroy({ where: {} });
  });

  describe("POST /follows", () => {
    it("creates a new follow", async () => {
      const response = await request(app).post("/follows").send({
        follower_id: users[0].id,
        followed_id: users[1].id,
      });

      expect(response.status).to.equal(201);
      expect(response.body.follower_id).to.equal(users[0].id);
      expect(response.body.followed_id).to.equal(users[1].id);

      const newFollowRecord = await Follow.findByPk(response.body.id, {
        raw: true,
      });

      expect(newFollowRecord).to.exist;
      expect(newFollowRecord.follower_id).to.equal(users[0].id);
      expect(newFollowRecord.followed_id).to.equal(users[1].id);
    });
  });

  describe("GET /follows", () => {
    it("gets all follow records", async () => {
      await Follow.bulkCreate([
        { follower_id: users[0].id, followed_id: users[1].id },
        { follower_id: users[1].id, followed_id: users[0].id },
      ]);

      const response = await request(app).get("/follows");

      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(2);

      const follows = await Follow.findAll({ raw: true });

      response.body.forEach((follow) => {
        const expected = follows.find(
          (f) =>
            f.follower_id === follow.follower_id &&
            f.followed_id === follow.followed_id
        );

        expect(expected).to.exist;
      });
    });
  });

  describe("GET /follows/:id", () => {
    it("gets follow records by id", async () => {
      const follow = await Follow.create({
        follower_id: users[0].id,
        followed_id: users[1].id,
      });

      const response = await request(app).get(`/follows/${follow.id}`);

      expect(response.status).to.equal(200);
      expect(response.body.follower_id).to.equal(users[0].id);
      expect(response.body.followed_id).to.equal(users[1].id);
    });

    it("returns 404 if the follow does not exist", async () => {
      const response = await request(app).get("/follows/12345");

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("follow could not be found.");
    });
  });

  describe("DELETE /follows/:id", () => {
    it("deletes follow record by id", async () => {
      const follow = await Follow.create({
        follower_id: users[0].id,
        followed_id: users[1].id,
      });

      const response = await request(app).delete(`/follows/${follow.id}`);
      const deletedFollow = await Follow.findByPk(follow.id);

      expect(response.status).to.equal(200);
      expect(deletedFollow).to.equal(null);
    });

    it("returns 404 if the follow does not exist", async () => {
      const response = await request(app).delete("/follows/12345");
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("follow could not be found.");
    });
  });
});
