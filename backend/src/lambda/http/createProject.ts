import 'source-map-support/register';
import { getUserId} from "./utils";
import { createProject } from "../../services/projects";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateProjectRequest } from "../../requests/CreateProjectRequest";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context): Promise<APIGatewayProxyResult> => {
    const newProject: CreateProjectRequest = JSON.parse(event.body)
  console.log("Processing event: ", event);
  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      project: await createProject(getUserId(event), newProject)
    }, null, 2),
  };
}
