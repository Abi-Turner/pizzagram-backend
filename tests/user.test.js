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
    describe("POST /users", () => {
      it("creates a new user in the database", async () => {
        const response = await request(app).post("/users").send({
          google_id: "some_id_1234",
          profile_picture: "https://example.com/profile.jpg",
          bio: "some bio text",
        });

        expect(response.status).to.equal(201);
      });
    });
  });
});
