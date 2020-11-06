import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Project } from '../models/Project';
import { createLogger } from '../utils/logger';
import { DynamoDBProjectItem } from './models/DynamoDBProjectItem';


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

    async getProject(userId: string, projectId: string): Promise<Project>{
        const key = {
            SK: getUserId(userId),
            PK: getProjectId(projectId)
        };
        try{
            const result = await this.docClient.get({
              TableName: this.projectIssuesTable,
              Key: key              
          }).promise();
            return result.Item as Project;
          }catch(e){
            logger.error(`Failed to get project for userId: ${userId}, projectId: ${projectId}`, {error: e.error.message});
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
}


function getUserId(rawUserId: string){
    logger.info(`Giving this userId: ${USER_PREFIX}${rawUserId}`);
    return `${USER_PREFIX}${rawUserId}`
}
function parseProjectIdFromSK(sk: string){
  return sk.replace(PROJECT_PREFIX, "");
}
function getProjectId(rawProjectId: string){
    return `${PROJECT_PREFIX}${rawProjectId}`
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