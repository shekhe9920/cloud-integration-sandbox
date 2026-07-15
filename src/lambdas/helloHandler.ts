import type { APIGatewayProxyEvent } from "aws-lambda";
import type { error } from "node:console";

export async function handler(event: APIGatewayProxyEvent) {
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
