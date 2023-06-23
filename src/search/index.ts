import express from "express";
import { Request, Response } from "express";
import Service from "./service/search.service";
import Context from "../lib/context";
import ValidateMiddleware from "./service/search.validate";
import ErrorMiddleware from "./service/search.error";
import { IApiCall, IService } from "./service/search.type";
import { ILogger } from "../type/logger";
import {ApiCall} from "./routing/search.routing";
import { LoggerAdapter } from '../lib/logger';

export default (logger: ILogger) => {

  logger = new LoggerAdapter(logger, "search service");
  const routing: IApiCall = new ApiCall(logger);

  let service: IService = new Service(logger, routing);

  service = new ValidateMiddleware(logger, service);
  service = new ErrorMiddleware(logger, service);

  const router = express.Router();


  router.post("/position/", async (req: Request, res: Response) => {
    const params = req.body;
    const ctx: Context = Context.createFromRequest(req);

    try {
      const data = await service.position(ctx, params);

      res.status(200).json({
        data: data.normalizeJSON(),
      });

    } catch (err) {
      res.status(err.code).json({
        error: err.message,
      });
    }
  });

  return router;
};
