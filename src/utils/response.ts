const { getReasonPhrase } = require("http-status-codes");
import { Response } from "express";

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

module.exports = { response };
