import { IApiCall, productListResponseSchema } from "../service/search.type";
import Context from "../../lib/context";
import axios, { AxiosResponse } from "axios";
import { BadRequestError, InternalError } from "../../lib/error";
import { ILogger } from "../../type/logger";

export class ApiCall implements IApiCall {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  async getProductById(ctx: Context, productId: string) {
    const serverUrl = process.env.REST_API;
    const url = `${serverUrl}products/${productId}/positions`;
    const xApiKey = process.env.REST_API_KEY;

    const headers = {
      "x-api-key": xApiKey,
    };

    let response: AxiosResponse;
    try {
      response = await axios.get(url, { headers });
    } catch (err) {
      if (err.response.status === 400) {
        throw new BadRequestError("bad request");
      } else {
        throw new InternalError("internal error");
      }
    }

    if (response.status !== 200) {
      this.logger.error(`Error calling ${url} with status ${response.status}`);
      throw new InternalError(`Error calling ${url}`);
    }

    const data = response.data;

    const { error } = productListResponseSchema.validate(data);

    if (error) {
      this.logger.warn(JSON.stringify(error));
      throw new BadRequestError("validation error", error);
    }

    return data;
  }
}
