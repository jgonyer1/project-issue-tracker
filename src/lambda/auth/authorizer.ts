import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import 'source-map-support/register';
import { verifyToken } from "../../auth/services/auth";
import { AuthorizerResultSuccess, AuthorizerResultFail } from "./models/authorizerResults";
import { createLogger } from '../../utils/logger';
const logger = createLogger("auth");
export const handler = async(event: APIGatewayTokenAuthorizerEvent ): Promise<CustomAuthorizerResult> =>{
    try{
        console.log("Processing event: ", event);
        const jwtToken = await verifyToken(event.authorizationToken);
        return new AuthorizerResultSuccess(jwtToken.sub);
    }
    catch(e){
        logger.error("User not authorized", {error: e.message});
        return new AuthorizerResultFail();
    }
}