const request = require("supertest");
const app = require("../app");

const CLIENT_ID = 2;

describe("postBalanceDeposit", () => {
  it("should return ok & transfer balance", async () => {
    const { Profile } = app.get("models");

    const { balance: oldClientBalance } = await Profile.findOne({
      where: { id: CLIENT_ID },
    });

    const amount = 10;

    const res = await request(app)
      .post(`/balances/deposit/${CLIENT_ID}`)
      .set("profile_id", CLIENT_ID)
      .send({ amount: 10 });

    const { balance: newClientBalance } = await Profile.findOne({
      where: { id: CLIENT_ID },
    });

    expect(res.statusCode).toEqual(200);
    expect(newClientBalance).toEqual(oldClientBalance + amount);
  });

  it("should return error if amount is too high", async () => {
    const res = await request(app)
      .post(`/balances/deposit/${CLIENT_ID}`)
      .set("profile_id", CLIENT_ID)
      .send({ amount: 1000 });

    expect(res.status).toEqual(401);
    expect(res.text).toMatchInlineSnapshot(`"Amount to deposit (1000), is too high (needs to be lower than 100.5, total unpaid jobs: 402)"`);
  });
});
