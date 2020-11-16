import 'source-map-support/register';
import { getUserId} from "./utils";
import { getProject } from "../../services/projects";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);
  const projectId = event.pathParameters.projectId
  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      project: await getProject(getUserId(event), projectId)
    }, null, 2),
  };
}
