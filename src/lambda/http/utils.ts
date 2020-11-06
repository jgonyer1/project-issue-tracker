import { APIGatewayProxyEvent } from "aws-lambda";
import { decode } from 'jsonwebtoken' 
import { JwtPayload } from '../../auth/models/JwtPayload';
/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}