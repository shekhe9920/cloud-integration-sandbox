/**
 * Creates a complete mock API Gateway event for Lambda tests.
 *
 * AWS handlers expect an APIGatewayProxyEvent with many required fields.
 * This helper provides default test values, while allowing each test to
 * override only the fields it needs, such as queryStringParameters or
 * pathParameters.
 */
import type { APIGatewayProxyEvent } from "aws-lambda";

export function createMockApiGatewayEvent(
  overrides: Partial<APIGatewayProxyEvent> = {},
): APIGatewayProxyEvent {
  const defaultEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "GET",
    isBase64Encoded: false,
    path: "/",
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    resource: "/",

    requestContext: {
      accountId: "test-account",
      apiId: "test-api",
      authorizer: undefined,
      protocol: "HTTP/1.1",
      httpMethod: "GET",
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: "127.0.0.1",
        user: null,
        userAgent: "vitest",
        userArn: null,
      },
      path: "/",
      stage: "test",
      requestId: "test-request-id",
      requestTimeEpoch: Date.now(),
      resourceId: "test-resource-id",
      resourcePath: "/",
    },
  } as APIGatewayProxyEvent;

  return {
    ...defaultEvent,
    ...overrides,
  };
}
