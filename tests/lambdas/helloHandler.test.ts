import { describe, it, expect } from "vitest";
import { handler } from "../../src/lambdas/helloHandler";
import { createMockApiGatewayEvent } from "../helpers/mockApiGatewayEvent";

describe("Test Hello Handler", () => {
  it("should say hello to correct user", async () => {
    const mockEvent = createMockApiGatewayEvent({
      queryStringParameters: {
        name: "Bob",
      },
    });

    const res = await handler(mockEvent);

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(bodyObject.message).toBe("Hello Bob!");
  });

  it("should set 'user' to 'guest' if user name null", async () => {
    const mockEvent = createMockApiGatewayEvent({
      queryStringParameters: null,
    });

    const res = await handler(mockEvent);

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(bodyObject.message).toBe("Hello guest!");
  });

  it("should set 'user' to 'guest' if user name empty string", async () => {
    const mockEvent = createMockApiGatewayEvent({
      queryStringParameters: {
        name: "",
      },
    });

    const res = await handler(mockEvent);

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(bodyObject.message).toBe("Hello guest!");
  });
});
