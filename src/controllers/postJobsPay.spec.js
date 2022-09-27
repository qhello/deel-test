const request = require("supertest");
const app = require("../app");

const JOB_ID = 2;
const CLIENT_ID = 1;
const CONTACTOR_ID = 6;

describe("postJobsPay", () => {
  it("should return ok & transfer balance", async () => {
    const { Profile, Job } = app.get("models");

    const job = await Job.findOne({ where: { id: JOB_ID } });
    const { balance: oldClientBalance } = await Profile.findOne({
      where: { id: CLIENT_ID },
    });
    const { balance: oldContractorBalance } = await Profile.findOne({
      where: { id: CONTACTOR_ID },
    });

    const res = await request(app)
      .post(`/jobs/${JOB_ID}/pay`)
      .set("profile_id", CLIENT_ID);

    const { balance: newClientBalance } = await Profile.findOne({
      where: { id: CLIENT_ID },
    });
    const { balance: newContractorBalance } = await Profile.findOne({
      where: { id: CONTACTOR_ID },
    });
    const updatedJob = await Job.findOne({ where: { id: JOB_ID } });

    expect(res.statusCode).toEqual(200);

    expect(job.paid).not.toEqual(true);
    expect(newClientBalance).toEqual(oldClientBalance - job.price);
    expect(newContractorBalance).toEqual(oldContractorBalance + job.price);
    expect(updatedJob.paid).toEqual(true);
  });

  it("should return error if job isn't found", async () => {
    const res = await request(app)
      .post(`/jobs/1667/pay`)
      .set("profile_id", CLIENT_ID);

    expect(res.status).toEqual(401);
    expect(res.text).toMatchInlineSnapshot(
      `"Couldn't find associated unpaid job"`
    );
  });

  it("should return error if client balance is too low", async () => {
    const res = await request(app).post(`/jobs/5/pay`).set("profile_id", 4);

    expect(res.status).toEqual(401);
    expect(res.text).toMatchInlineSnapshot(
      `"Can't pay - your balance is too low"`
    );
  });

  it("should return error if isnt a client", async () => {
    const res = await request(app)
      .post(`/jobs/${JOB_ID}/pay`)
      .set("profile_id", CONTACTOR_ID);

    expect(res.status).toEqual(401);
    expect(res.text).toMatchInlineSnapshot(`"You arent a client"`);
  });
});
