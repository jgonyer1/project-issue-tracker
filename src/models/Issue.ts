import { DynamoDBIssueItem } from '../data/models/DynamoDBIssueItem';
export class Issue{
    id: string;
    type: string;
    status: string;
    description: string;
    ticketNumber: number;
    constructor(dynamodbProjectIssueItem: DynamoDBIssueItem){
        this.id = dynamodbProjectIssueItem.SK.split("_")[1];
        this.status = dynamodbProjectIssueItem.status;
        this.description = dynamodbProjectIssueItem.description;
        this.ticketNumber = dynamodbProjectIssueItem.ticketNumber;
    }
}