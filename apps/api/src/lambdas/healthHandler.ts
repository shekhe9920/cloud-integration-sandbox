/**
 * AWS Lambda handler for the health endpoint.
 *
 * Expected API Gateway route:
 * GET /health
 */
export async function handler() {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            status: "ok"
        })
    }
}
