import request from "supertest";
import app from "../../app.js";

describe("getJobsUnpaid", () => {
  it("should return jobs", async () => {
    const res = await request(app).get("/jobs/unpaid").set("profile_id", 2);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchSnapshot([
      {
        Contract: {
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        Contract: {
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]);
  });
});
