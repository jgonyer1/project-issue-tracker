export class DynamoDBProjectIssueItem{
    PK: string;
    SK: string;
    constructor(pk: string, sk: string){
        this.PK = pk;
        this.SK = sk;
    }
}