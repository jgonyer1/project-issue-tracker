import { Issue } from "./Issue";
import { DynamoDBProjectItem } from '../data/models/DynamoDBProjectItem';
export class Project {
    id: string;
    name: string;
    issues?: Array<Issue>;
    description?: string;

    constructor(dynamodbProjectIssueItem: DynamoDBProjectItem){
      this.id = dynamodbProjectIssueItem.SK.replace("PROJECT#", "");
      this.name = dynamodbProjectIssueItem.name;
    }
    
    determineNextIssueNumber(): number{
      if(this.issues.length === 0){
        return 1;
      }
      let currentHighestIssueNumber: number = Math.max(...this.issues.map(issue => issue.issueNumber));
      console.log(`CurrentHighestIssueNumber in projectId ${this.id}: ${currentHighestIssueNumber}`);
       return currentHighestIssueNumber + 1;
    }
  }
  