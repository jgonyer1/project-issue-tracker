import 'source-map-support/register';
import { getUserId} from "./utils";
import { deleteIssue } from "../../services/projects";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context): Promise<APIGatewayProxyResult> => {
  const projectId = event.pathParameters.projectId
  const issueId = event.pathParameters.issueId
  
  console.log(`Delete issue for Id: ${issueId}`);
  
  const result = await deleteIssue(getUserId(event), projectId, issueId);
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
