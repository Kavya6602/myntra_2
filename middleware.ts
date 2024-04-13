import { Request, Response, NextFunction } from 'express';
import { v4 } from 'uuid';

export const generateUUID = () => {
  return v4();
};

export const addRequestId = (req: Request, res: Response, next:  NextFunction) => {
  req.headers["request_id"] = generateUUID();
  console.log(`Request id - ${req.headers['request_id']}`);
  next();
};

export const logRequest = (req: Request,res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}]  Method: ${req.method}, URL: ${req.url}`);
    next(); 
}

export const validateQueryParams = (req: Request,res: Response, next: NextFunction) => {
    const { limit, offset } = req.query;
    const limitNumber = parseInt(limit as string, 10);
    const offsetNumber = parseInt(offset as string, 10);
    if (!limit || !offset || limitNumber < 0 || offsetNumber < 0) {
      return res.status(400).send({ message: 'Invalid limit or offset values' });
    }
    next();
}
