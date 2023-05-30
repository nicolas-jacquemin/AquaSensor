import dotenv from "dotenv";
import { fet } from "./mockedFetch.js";

dotenv.config();

describe("Unknown Route", () => {
  it("Unknown route", async () => {
    const result = await fet(`http://localhost:${process.env.PORT}/`);
    expect(result.ret).toEqual({
      request: "Unknown",
      errors: [
          "Route not found, please visit /docs for more information"
      ],
      status: 404
  });
    expect(result.code).toEqual(404);
  });
});
