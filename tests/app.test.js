const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

describe("App working correctly", () => {
  describe("GET /", () => {
    it("sends Hello World", async () => {
      const response = await request(app).get("/");
      expect(response.status).to.equal(200);
      expect(response.text).to.equal("Hello World!");
    });
  });
});
