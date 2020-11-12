import 'source-map-support/register';
import { getUserId} from "./utils";
import { updateIssue } from "../../services/projects";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateIssueRequest } from "../../requests/UpdateIssueRequest";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context): Promise<APIGatewayProxyResult> => {
  const issueId = event.pathParameters.issueId
  const updatedIssue = JSON.parse(event.body);
  updatedIssue.issueId = issueId
  console.log(`Update issue for Id: ${issueId}`);
  console.log("Updated issue: ", updatedIssue);
  const result = await updateIssue(getUserId(event), updatedIssue as UpdateIssueRequest);
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
