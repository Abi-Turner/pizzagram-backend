const { expect } = require("chai");
const request = require("supertest");
const { User } = require("../src/models");
const app = require("../src/app");

describe("/users", () => {
  before(async () => await User.sequelize.sync({ force: true }));

  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe("with no records in database", () => {
    describe("POST /users with email", () => {
      it("creates a new user in the database with email", async () => {
        const response = await request(app).post("/users").send({
          email: "test@example.com",
          password: "password",
          profile_picture: "https://example.com/profile.jpg",
          bio: "some bio text",
        });

        expect(response.status).to.equal(201);
        expect(response.body.email).to.equal("test@example.com");
        expect(response.body.bio).to.equal("some bio text");

        const newUserRecord = await User.findByPk(response.body.id, {
          raw: true,
        });

        expect(newUserRecord).to.exist;
        expect(newUserRecord.email).to.equal("test@example.com");
      });
    });
  });

  describe("with records in the database", () => {
    let users;

    beforeEach(async () => {
      users = await Promise.all([
        User.create({
          email: "test2@example.com",
          password: "password",
          profile_picture: "https://example.com/profile.jpg",
          bio: "some bio text",
        }),
        User.create({
          email: "test3@example.com",
          password: "password",
          profile_picture: "https://example.com/profile.jpg",
          bio: "some more bio text",
        }),
        User.create({
          email: "test4@example.com",
          password: "password",
          profile_picture: "https://example.com/profile.jpg",
          bio: "even more bio text",
        }),
      ]);
    });

    describe("GET /users", () => {
      it("gets all user records", async () => {
        const response = await request(app).get("/users");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((user) => {
          const expected = users.find((a) => a.id === user.id);

          expect(user.email).to.equal(expected.email);
          expect(user.profile_picture).to.equal(expected.profile_picture);
          expect(user.bio).to.equal(expected.bio);
        });
      });
    });

    describe("GET /users/:id", () => {
      it("gets user records by id", async () => {
        const user = users[0];
        const response = await request(app).get(`/users/${user.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(user.email);
        expect(response.body.profile_picture).to.equal(user.profile_picture);
        expect(response.body.bio).to.equal(user.bio);
      });

      it("returns 404 status if the user does not exist", async () => {
        const response = await request(app).get("/users/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("user could not be found.");
      });
    });

    describe("PATCH /users/:id", () => {
      it("updates users bio by id", async () => {
        const user = users[0];
        const response = await request(app).patch(`/users/${user.id}`).send({
          bio: "This is the updated bio!",
        });

        const updatedUserRecord = await User.findByPk(user.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(updatedUserRecord.bio).to.equal("This is the updated bio!");
      });

      it("returns a 404 if the user does not exist", async () => {
        const response = await request(app).patch("/users/1234567").send({
          bio: "This is the updated bio!",
        });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("user could not be found.");
      });
    });

    describe("DELETE /users/:id", () => {
      it("deletes user record by id", async () => {
        const user = users[0];
        const response = await request(app).delete(`/users/${user.id}`);
        const deletedUser = await User.findByPk(user.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(deletedUser).to.equal(null);
      });

      it("returns 404 if the user does not exist", async () => {
        const response = await request(app).delete("/users/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("user could not be found.");
      });
    });
  });
});
