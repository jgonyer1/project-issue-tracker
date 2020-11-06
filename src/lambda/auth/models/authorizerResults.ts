export class AuthorizerResultSuccess{
  principalId: string;
  policyDocument: any;
  
  constructor(principalId: string){
      this.principalId = principalId;
      this.policyDocument = {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: '*'
            }
          ]
      };
  }
}
export class AuthorizerResultFail{
    principalId: string;
    policyDocument: any;
    
    constructor(){
        this.principalId = "user";
        this.policyDocument = {
            Version: '2012-10-17',
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: 'Deny',
                Resource: '*'
              }
            ]
        };
    }
}