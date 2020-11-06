import {DynamoDBProjectIssueItem} from './DynamoDBProjectIssueItem';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
export class DynamoDBProjectItem extends DynamoDBProjectIssueItem{
    name: string;
    constructor(dynamoDBItem: DocumentClient.AttributeMap) {
        console.log("raw attr map from ddb: ", dynamoDBItem);

        const pk =  dynamoDBItem.PK.startsWith("USER#") ? dynamoDBItem.PK : `USER#${dynamoDBItem.PK}`;
        const sk = dynamoDBItem.SK.startsWith("PROJECT#") ? dynamoDBItem.SK : `PROJECT#${dynamoDBItem.SK}`;
        super(pk, sk);
        this.name = dynamoDBItem.name;        
    }
}