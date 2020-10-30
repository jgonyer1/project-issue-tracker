import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register';
import { getProjects } from "../services/projects";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      projets: getProjects(),
      input: event,
    }, null, 2),
  };
}
