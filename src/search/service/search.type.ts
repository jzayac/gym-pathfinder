import * as joi from "types-joi";
import Context from "../../lib/context";
import { InterfaceFrom } from "types-joi";
import { PickingOrder } from "../../model/search";

export interface IService {
  position(ctx: Context, productIds: ISearchRequest): Promise<PickingOrder>;
}

export interface IApiCall {
  getProductById(ctx: Context, productId: string): Promise<IProductListResponse>;
}

const searchRequest = {
  ids: joi.array().items(joi.string().required()).min(1).required(),
};

export const searchRequestSchema = joi.object({ ...searchRequest }).required();
export type ISearchRequest = InterfaceFrom<typeof searchRequestSchema>;

const productListResponse = joi.object({
  positionId: joi.string().required(),
  x: joi.number().required(),
  y: joi.number().required(),
  z: joi.number().required(),
  productId: joi.string().required(),
  quantity: joi.number().required(),
});

export const productListResponseSchema = joi.array().items(productListResponse).required();
export type IProductListResponse = InterfaceFrom<typeof productListResponseSchema>;
