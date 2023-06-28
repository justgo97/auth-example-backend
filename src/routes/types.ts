import { Response, Request } from "express";

export interface IRes extends Response {
  user?: {
    rank?: number;
    name?: string;
    email?: string;
    nickname?: string;
  };
}

export interface IReq extends Request {
  user?: {
    rank?: number;
    name?: string;
    email?: string;
    nickname?: string;
  };
}
