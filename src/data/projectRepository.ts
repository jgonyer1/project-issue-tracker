import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Project } from '../models/Project';
import { Issue } from '../models/Issue';
import { createLogger } from '../utils/logger';
import { UpdateIssueRequest } from '../requests/UpdateIssueRequest';
import { DynamoDBProjectItem } from './models/DynamoDBProjectItem';
import { DynamoDBIssueItem } from './models/DynamoDBIssueItem';


const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger("projectAccess");

const USER_PREFIX = "USER#";
const PROJECT_PREFIX = "PROJECT#";
//const PROJECT_ISSUE_PREFIX = "PROJECT_ISSUE#";

export class ProjectRepository{
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly projectIssuesTable = process.env.PROJECT_ISSUES_TABLE
    ){}

    async getProjects(userId: string): Promise<DynamoDBProjectItem[]>{
        try{
            const result = await this.docClient.query({
              TableName: this.projectIssuesTable,
              KeyConditionExpression: "PK = :userId and begins_with(SK, :projectPrefix)",
              ExpressionAttributeValues:{
                ":userId": getUserId(userId),
                ":projectPrefix": PROJECT_PREFIX
              }
          }).promise();
            return result.Items.map(item => { return  new DynamoDBProjectItem(item) });
          }catch(e){
            logger.error(`Failed to get projects for userId: ${userId}`, {error: e});
          }
    }

    async getProject(userId: string, projectId: string): Promise<DynamoDBProjectItem>{
        const key = {
            PK: getUserId(userId),
            SK: getProjectId(projectId)
        };
        try{
            const result = await this.docClient.get({
              TableName: this.projectIssuesTable,
              Key: key              
          }).promise();
            return result.Item as DynamoDBProjectItem;
          }catch(e){
            logger.error(`Failed to get project for userId: ${userId}, projectId: ${projectId}`, e);
          }
    }

    async getIssuesForProject(userId: string, projectId: string){
      const keyConditionExpression = "PK = :userId and begins_with(SK, :issuePrefix)"
      const expressionAttributeValues = {
        ":userId": getUserId(userId),
        ":issuePrefix": `PROJECT_ISSUE#${projectId}_`
      };
      try{
        const result = await this.docClient.query({
          TableName: this.projectIssuesTable,
          KeyConditionExpression: keyConditionExpression,
          ExpressionAttributeValues: expressionAttributeValues
        }).promise();
        return result.Items.map(item => new DynamoDBIssueItem(item));
      }catch(e){
        logger.error(`Failed to get issues for userId: ${userId}, projectId: ${projectId}`, e);
      }      
    }

    async createProject(userId: string, newProject: Project): Promise<Project>{
      const attributeMap = {
        PK: userId,
        SK: newProject.id,
        name: newProject.name
      }
      const dynamodbProjectItem: DynamoDBProjectItem = new DynamoDBProjectItem(attributeMap);
      try{
        await this.docClient.put({
          TableName: this.projectIssuesTable,
          Item: dynamodbProjectItem
        }).promise();
      }catch(e){
        logger.error(`Failed to add new project: `, dynamodbProjectItem);
      }
      
      return newProject;
    }

    async createIssue(userId: string, newIssue: Issue): Promise<Issue>{
      const attributeMap = {
        PK: userId,
        SK: newIssue.id,
        description: newIssue.description,
        type: newIssue.type,
        issueNumber: newIssue.issueNumber,
        status: newIssue.status
      }
      const dynamodbIssueItem: DynamoDBIssueItem = new DynamoDBIssueItem(attributeMap);
      try{
        await this.docClient.put({
          TableName: this.projectIssuesTable,
          Item: dynamodbIssueItem
        }).promise();
      }catch(e){
        logger.error(`Failed to add new project: `, dynamodbIssueItem);
      }
      
      return newIssue;
    }

    async updateIssue(userId: string, updateIssueRequest: UpdateIssueRequest): Promise<any>{
      const pkUserId = getUserId(userId);
      const sk = getIssueSK(updateIssueRequest.projectId, updateIssueRequest.issueId);
      console.log("Key: ", { PK: pkUserId, SK: sk });
      const upddateItemOutput = await this.docClient.update({
        TableName: this.projectIssuesTable,
        Key:{ PK: pkUserId, SK: sk },
        UpdateExpression: buildUpdateStatement(updateIssueRequest),
        ExpressionAttributeNames: getUpdateExpressionAttributeNames(updateIssueRequest),
        ExpressionAttributeValues: getUpdateExpressionValues(updateIssueRequest)
      }).promise();
      console.log("Result from update: ", upddateItemOutput);
      return {};
    }
}


function getUserId(rawUserId: string){
    logger.info(`Giving this userId: ${USER_PREFIX}${rawUserId}`);
    return `${USER_PREFIX}${rawUserId}`
}
function getProjectId(rawProjectId: string){
    return `${PROJECT_PREFIX}${rawProjectId}`
}

function getIssueSK(projectId: string, issueId: string){
  return `PROJECT_ISSUE#${projectId}_${issueId}`;
}

const filterIdsFromUpdateRequest = key => key !== "issueId" && key !== "projectId";

function buildUpdateStatement(updateIssueItem: UpdateIssueRequest): string{
  return `SET ${Object.keys(updateIssueItem).filter(filterIdsFromUpdateRequest).map(key => `#${key} = :${key}`)}` ;
}
function getUpdateExpressionValues(updateIssueItem: UpdateIssueRequest): any{
  return Object.keys(updateIssueItem).filter(filterIdsFromUpdateRequest).reduce(function(accumulator, currentValue){
    accumulator[`:${currentValue}`] = updateIssueItem[currentValue];
    return accumulator;
  }, {});
}
function getUpdateExpressionAttributeNames(updateIssueItem: UpdateIssueRequest){
  return Object.keys(updateIssueItem).filter(filterIdsFromUpdateRequest).reduce(function(accumulator, currentValue){
    accumulator[`#${currentValue}`] = currentValue;
    return accumulator;
  }, {});
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
}