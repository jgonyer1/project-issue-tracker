import { DynamoDBIssueItem } from '../data/models/DynamoDBIssueItem';
export class Issue{
    id: string;
    type: string;
    status: string;
    description: string;
    issueNumber: number;
    constructor(dynamodbProjectIssueItem: DynamoDBIssueItem){
        this.id = dynamodbProjectIssueItem.SK.split("_")[2];
        this.status = dynamodbProjectIssueItem.status;
        this.description = dynamodbProjectIssueItem.description;
        this.issueNumber = dynamodbProjectIssueItem.issueNumber;
        this.type = dynamodbProjectIssueItem.type;
    }
}