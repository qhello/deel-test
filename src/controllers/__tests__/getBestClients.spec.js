import request from "supertest";
import app from "../../app.js";

describe("getBestClients", () => {
  it("should return best clients", async () => {
    const res = await request(app).get("/admin/best-clients").query({
      start: "2020-08-17",
      end: "2020-12-31",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchSnapshot();
    expect(res.body.length).toBe(2);
  });

  it("should return best clients", async () => {
    const res = await request(app).get("/admin/best-clients").query({
      start: "2020-08-10",
      end: "2020-12-31",
      limit: 5,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchSnapshot();
    expect(res.body.length).toBe(4);
  });
});
