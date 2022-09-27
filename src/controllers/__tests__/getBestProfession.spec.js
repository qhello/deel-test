import request from "supertest";
import app from "../../app.js";

describe("getBestProfession", () => {
  it("should return Musician", async () => {
    const res = await request(app).get("/admin/best-profession").query({
      start: "2020-08-17",
      end: "2020-12-31",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchInlineSnapshot({
  profession: "Musician" }, `
{
  "profession": "Musician",
  "totalPaid": 200,
}
`);
  });

  it("should return Programmer", async () => {
    const res = await request(app).get("/admin/best-profession").query({
      start: "2020-01-01",
      end: "2020-12-31",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchInlineSnapshot({
  profession: "Programmer" }, `
{
  "profession": "Programmer",
  "totalPaid": 2683,
}
`);
  });
});
