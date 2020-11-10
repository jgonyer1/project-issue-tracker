import {DynamoDBProjectIssueItem} from './DynamoDBProjectIssueItem';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
export class DynamoDBIssueItem extends DynamoDBProjectIssueItem{
    type: string;
    issueNumber: number;
    description: string;
    status: string;
    constructor(dynamoDBItem: DocumentClient.AttributeMap) {
        console.log("raw attr map from ddb: ", dynamoDBItem);

        const pk =  dynamoDBItem.PK.startsWith("USER#") ? dynamoDBItem.PK : `USER#${dynamoDBItem.PK}`;
        const sk = dynamoDBItem.SK.startsWith("PROJECT_ISSUE#") ? dynamoDBItem.SK : `PROJECT_ISSUE#${dynamoDBItem.SK}`;
        super(pk, sk);
        this.type = dynamoDBItem.type;        
        this.issueNumber = dynamoDBItem.issueNumber;        
        this.description = dynamoDBItem.description;        
        this.status = dynamoDBItem.status;            
    }
}