import { verify, decode } from "jsonwebtoken";
import { JwtPayload } from "../models/JwtPayload";
import { Jwt } from "../models/Jwt";
import * as jwksClient from "jwks-rsa";
const jwksUrl = process.env.JWKS_URL;

export function getToken(authHeader: string){
    if (!authHeader){
        throw new Error('No authentication header');
    } 
    if (!authHeader.toLowerCase().startsWith('bearer ')){
        throw new Error(`Invalid authentication header, received this header: ${authHeader}`);
    }  
    return authHeader.split(' ')[1];
}

export async function verifyToken(authHeader: string): Promise<JwtPayload> {
    const token = getToken(authHeader)
    console.log("Got Token: ", token);
    const decoded = decode(token, { complete: true }) as Jwt;
  
    await verify(token, function(){
      return jwksClient({jwksUri: jwksUrl}).getSigningKey(decoded.header.kid, function(err, key){
        if(!err)
          return key.getPublicKey();
        throw new Error('Error Getting signingKey: ${err}');
      });
    }, {}, function(err, decoded){
      if(err)
        throw new Error('Error verifying token: ${err}');
      return decoded;
  
    });
    // TODO: Implement token verification
    // You should implement it similarly to how it was implemented for the exercise for the lesson 5
    // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
    return decoded.payload;
}