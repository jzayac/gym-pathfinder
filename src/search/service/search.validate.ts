import { PickingOrder } from "../../model/search";
import Context from "../../lib/context";

import {
  IService,
  ISearchRequest as searchParams,
  searchRequestSchema,
} from "./search.type";
import { BadRequestError } from "../../lib/error";
import { ILogger } from "../../type/logger";

export default class ValidateService implements IService {
  private logger: ILogger;
  private service: IService;

  constructor(logger: ILogger, service: IService) {
    this.service = service;
    this.logger = logger;
  }

  async position(ctx: Context, params: searchParams): Promise<PickingOrder> {
    this.logger.info("validating position request" );
    const { error } = searchRequestSchema.validate(params);

    if (error) {
      this.logger.warn(JSON.stringify(error));
      throw new BadRequestError("validation error", error);
    }
    return await this.service.position(ctx, params);
  }
}
