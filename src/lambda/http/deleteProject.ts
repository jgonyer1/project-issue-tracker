import 'source-map-support/register';
import { getUserId} from "./utils";
import { deleteProject } from "../../services/projects";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context): Promise<APIGatewayProxyResult> => {
  const projectId = event.pathParameters.projectId
  
  
  const result = await deleteProject(getUserId(event), projectId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        result: result
    })
  }
}
