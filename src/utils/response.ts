import { Response } from "express";
import { getReasonPhrase } from "http-status-codes";

const response = async (res: Response, code: any, status: boolean, data: any, message: string) => {
  if (!message) {
    message = getReasonPhrase(code);
  }
  return res.status(code).json({
    status: status,
    data: data,
    message: message,
  });
};

export { response };
