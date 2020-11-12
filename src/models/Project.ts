import { Issue } from "./Issue";
import { DynamoDBProjectItem } from '../data/models/DynamoDBProjectItem';
export class Project {
    id: string;
    name: string;
    issues?: Array<Issue>;
    description?: string;

    constructor(dynamodbProjectIssueItem: DynamoDBProjectItem){
      console.log("raw project item: ", dynamodbProjectIssueItem);
      this.id = dynamodbProjectIssueItem.SK.replace("PROJECT#", "");
      this.name = dynamodbProjectIssueItem.name;
    }
    
    determineNextIssueNumber(): number{
      let currentHighestIssueNumber: number = Math.max(...this.issues.map(issue => issue.issueNumber));
       return currentHighestIssueNumber + 1;
    }
  }
  