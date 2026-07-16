import type { APIGatewayProxyEvent } from "aws-lambda";
import type { error } from "node:console";

/**
 * AWS Lambda handler for a simple greeting endpoint.
 *
 * Expected API Gateway route:
 * GET /hello?name=your-name
 */
export async function handler(event: APIGatewayProxyEvent) {
  // The name query parameter is optional. If it is missing, guest is used.
  const userName = event.queryStringParameters?.name || "guest";

  const msg = `Hello ${userName}!`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: msg,
    }),
  };
}
