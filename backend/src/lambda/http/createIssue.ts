import 'source-map-support/register';
import { getUserId} from "./utils";
import { createIssue } from "../../services/projects";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateIssueRequest } from "../../requests/CreateIssueRequest";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context): Promise<APIGatewayProxyResult> => {
  console.log("Got this body: ", JSON.parse(event.body));
  const projectId = event.pathParameters.projectId;
  const newIssue: CreateIssueRequest = JSON.parse(event.body)
  newIssue.projectId = projectId;
  console.log("Processing event: ", event);
  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      project: await createIssue(getUserId(event), newIssue)
    }, null, 2),
  };
}
