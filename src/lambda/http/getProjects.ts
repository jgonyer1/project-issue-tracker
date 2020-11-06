import 'source-map-support/register';
import { getUserId} from "./utils";
import { getProjects } from "../../services/projects";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);
  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      projects: await getProjects(getUserId(event))
    }, null, 2),
  };
}
