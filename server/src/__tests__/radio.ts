import { app } from "../app.js";
import dotenv from "dotenv";
import { fet } from "./mockedFetch.js";

dotenv.config();

describe("Get no radio", () => {
  it("No radio", async () => {
    const result = await fet(`http://localhost:${process.env.PORT}/radio`);
    expect(result.ret).toEqual({
      request: "radio.get",
      data: {
        radios: []
      },
      status: 200
  });
    expect(result.code).toEqual(200);
  });
});