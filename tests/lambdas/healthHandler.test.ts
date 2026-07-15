import { describe, it, expect } from "vitest";
import { handler } from "../../src/lambdas/healthHandler";

describe("Test Health Handler", () => {
  it("should return 200 OK", async () => {
    const res = await handler();

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.headers).toEqual({
      "Content-Type": "application/json",
    });
    expect(bodyObject).toEqual({
      status: "ok",
    });
  });
});
