import { Response } from "express";

type TMeta = {
  page: number;
  size: number;
  total: number;
}

type TSendResponse <T> = {
  success : boolean;
  statusCode : number;
  message : string;
  data: T;
  meta ?: TMeta
}

export const sendResponse = <T>(res : Response, data : TSendResponse<T>) => {
  const {success, statusCode, message, data: responseData, meta} = data;
  res.status(statusCode).json({
    success,
    statusCode,
    message,
    data: responseData,
    meta
  })
}