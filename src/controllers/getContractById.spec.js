const request = require("supertest");
const app = require("../app");

describe("getContractById", () => {
  it("should return contract", async () => {
    const res = await request(app).get("/contracts/1").set("profile_id", 5);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchSnapshot();
  });

  it("should return contract", async () => {
    const res = await request(app).get("/contracts/1").set("profile_id", 1);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchSnapshot();
  });

  it("should return 404 if contract doesn't belong to profile", async () => {
    const res = await request(app).get("/contracts/1").set("profile_id", 2);

    expect(res.statusCode).toEqual(404);
  });

  it("should return 404 if contract doesn't exists", async () => {
    const res = await request(app)
      .get("/contracts/foobar")
      .set("profile_id", 5);

    expect(res.statusCode).toEqual(404);
  });
});
