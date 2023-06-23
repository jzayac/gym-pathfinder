import Context from "../../../src/lib/context";
import Service from "../../../src/search/service/search.service";
import {
  IApiCall,
  IProductListResponse,
} from "../../../src/search/service/search.type";

class ApiCallMock implements IApiCall {
  async getProductById(
    ctx: Context,
    productId: string
  ): Promise<IProductListResponse> {
    if (productId === "product-1") {
      return [
        {
          positionId: "position-11",
          x: 3,
          y: 1,
          z: 0,
          productId: "product-1",
          quantity: 2,
        },
        {
          positionId: "position-12",
          x: 3,
          y: 1,
          z: 1,
          productId: "product-1",
          quantity: 1,
        },
      ];
    } else if (productId === "product-2") {
      return [
        {
          positionId: "position-21",
          x: 3,
          y: 1,
          z: 4,
          productId: "product-2",
          quantity: 1,
        },
        {
          positionId: "position-22",
          x: 30,
          y: 1,
          z: 4,
          productId: "product-2",
          quantity: 1,
        },
        {
          positionId: "position-23",
          x: 3,
          y: 10,
          z: 4,
          productId: "product-2",
          quantity: 1,
        },
      ];
    } else if (productId === "product-3") {
      return [
        {
          positionId: "position-31",
          x: 3,
          y: 1,
          z: 2,
          productId: "product-3",
          quantity: 1,
        },
      ];
    }

    return [
      {
        positionId: `position-${productId}1`,
        x: 3,
        y: 1,
        z: 4,
        productId: productId,
        quantity: 1,
      },
    ];
  }
}

describe("search ", () => {
  it("product id with quantity 1", async () => {
    const ctx = new Context();
    const service = new Service(console, new ApiCallMock());
    const params = {
      ids: ["product-1", "product-2"],
    };
    const result = await service.position(ctx, params);

    expect(result).toEqual({
      pickingOrder: [
        {
          positionId: "position-12",
          productId: "product-1",
          x: 3,
          y: 1,
          z: 1,
          quantity: 1,
        },
        {
          positionId: "position-21",
          x: 3,
          y: 1,
          z: 4,
          productId: "product-2",
          quantity: 1,
        },
      ],
      distance: 3,
    });
  });

  it("product id 1 with quantity 2", async () => {
    const ctx = new Context();
    const service = new Service(console, new ApiCallMock());
    const params = {
      ids: ["product-1", "product-2", "product-1"],
    };
    const result = await service.position(ctx, params);

    expect(result).toEqual({
      pickingOrder: [
        {
          positionId: "position-11",
          productId: "product-1",
          quantity: 2,
          x: 3,
          y: 1,
          z: 0,
        },
        {
          positionId: "position-21",
          productId: "product-2",
          quantity: 1,
          x: 3,
          y: 1,
          z: 4,
        },
      ],
      distance: 4,
    });
  });

  it("find 3 products", async () => {
    const ctx = new Context();
    const service = new Service(console, new ApiCallMock());
    const params = {
      ids: ["product-1", "product-3", "product-2"],
    };
    const result = await service.position(ctx, params);

    expect(result).toEqual({
      pickingOrder: [
        {
          positionId: "position-12",
          x: 3,
          y: 1,
          z: 1,
          productId: "product-1",
          quantity: 1,
        },
        {
          positionId: "position-31",
          x: 3,
          y: 1,
          z: 2,
          productId: "product-3",
          quantity: 1,
        },
        {
          positionId: "position-21",
          x: 3,
          y: 1,
          z: 4,
          productId: "product-2",
          quantity: 1,
        },
      ],
      distance: 3,
    });
  });

  it("find 3 products in different order", async () => {
    const ctx = new Context();
    const service = new Service(console, new ApiCallMock());
    const params = {
      ids: ["product-1", "product-2", "product-3"],
    };
    const result = await service.position(ctx, params);

    expect(result).toEqual({
      pickingOrder: [
        {
          positionId: "position-12",
          x: 3,
          y: 1,
          z: 1,
          productId: "product-1",
          quantity: 1,
        },
        {
          positionId: "position-31",
          x: 3,
          y: 1,
          z: 2,
          productId: "product-3",
          quantity: 1,
        },
        {
          positionId: "position-21",
          x: 3,
          y: 1,
          z: 4,
          productId: "product-2",
          quantity: 1,
        },
      ],
      distance: 3,
    });
  });
});
