import { JwtHeader } from "jsonwebtoken";
import { JwtPayload } from "../models/JwtPayload";
export interface Jwt{
    header: JwtHeader,
    payload: JwtPayload
};