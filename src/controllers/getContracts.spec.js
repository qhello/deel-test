const request = require("supertest");
const app = require("../app");

describe("getContracts", () => {
  it("should return contracts", async () => {
    const res = await request(app).get("/contracts").set("profile_id", 1);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchSnapshot([
      {
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]);
  });
});
