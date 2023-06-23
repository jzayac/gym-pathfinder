import { PickingOrder } from "../../model/search";
import Context from "../../lib/context";
import * as Err from "../../lib/error";
import { ILogger } from "../../type/logger";

import { IService, ISearchRequest as searchParams } from "./search.type";

export default class ErrorService implements IService {
  private logger: ILogger;
  private service: IService;

  constructor(logger: ILogger, service: IService) {
    this.service = service;
    this.logger = logger;
  }

  async position(ctx: Context, params: searchParams): Promise<PickingOrder> {
    try {
      return await this.service.position(ctx, params);
    } catch (err) {
      if (!(err instanceof Err.BaseError)) {
        this.logger.error("unhandled error", err);
        throw new Err.InternalError("unknown error");
      } else {
        this.logger.error(err.message, err);
      }

      throw err;
    }
  }
}
