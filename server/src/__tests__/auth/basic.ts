import { fet } from "../mockedFetch.js";

let admin_jwt = "";
let admin_renew = "";

describe("Login", () => {
  it("Login with admin", async () => {
    const result = await fet(`http://localhost:${process.env.PORT}/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          username: "admin",
          password: process.env.ADMIN_PASSWORD
        })
      });
    expect(result.ret).toHaveProperty("data");
    expect(result.ret.data).toHaveProperty("token");
    expect(result.ret.data).toHaveProperty("expUTC");
    expect(result.ret.data).toHaveProperty("refreshToken");
    expect(result.ret.data).toHaveProperty("refreshExpUTC");
    expect(result.code).toEqual(200);
    admin_jwt = result.ret.data.token;
    admin_renew = result.ret.data.refreshToken;
  });
});

describe("Refresh", () => {
  it("Refresh with admin", async () => {
    const result = await fet(`http://localhost:${process.env.PORT}/auth/renewToken`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          refreshToken: admin_renew
        })
      });
    expect(result.ret).toHaveProperty("data");
    expect(result.ret.data).toHaveProperty("token");
    expect(result.ret.data).toHaveProperty("expUTC");
    expect(result.ret.data).toHaveProperty("refreshToken");
    expect(result.ret.data).toHaveProperty("refreshExpUTC");
    expect(result.code).toEqual(200);
    const testOlderAT = await fet(`http://localhost:${process.env.PORT}/auth/infos`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${admin_jwt}`
        }
    });
    expect(testOlderAT.code).toEqual(401);
    admin_jwt = result.ret.data.token;
    admin_renew = result.ret.data.refreshToken;
  });
});

describe("Logout", () => {
  it("Logout with admin", async () => {
    const result = await fet(`http://localhost:${process.env.PORT}/auth/destroyTokenFamily`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${admin_jwt}`
        }
      });
    expect(result.ret).toEqual({
      request: "auth.destroyTokenFamily",
      status: 200
    });
    expect(result.code).toEqual(200);
    const testAfterLoggedOut = await fet(`http://localhost:${process.env.PORT}/auth/infos`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${admin_jwt}`
        }
    });
    expect(testAfterLoggedOut.code).toEqual(401);
  });
});
