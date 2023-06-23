import { PickingOrder, ProductPosition } from "../../model/search";
import Context from "../../lib/context";
import { ILogger } from "../../type/logger";

import {
  IService,
  ISearchRequest as searchParams,
  IApiCall,
} from "./search.type";

type IProduct = {
  id: string;
  requiredQuantity: number;
  locations: ProductPosition[];
};

export default class SearchService implements IService {
  private logger: ILogger;
  private routing: IApiCall;

  constructor(logger: ILogger, routing: IApiCall) {
    this.logger = logger;
    this.routing = routing;
  }

  _calculateDistance(coordA: ProductPosition, coordB: ProductPosition) {
    const dx = coordA.x - coordB.x;
    const dy = coordA.y - coordB.y;
    const dz = coordA.z - coordB.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Generate all permutations of the products
  // Example:
  // Input: [{id: 1}, {id: 2}]
  // Output: [
  //  [{id: 1}, {id: 2}],
  //  [{id: 2}, {id: 1}],
  // ]
  private _generatePermutations(arr: IProduct[]) {
    const result: IProduct[][] = [];

    const permute = (arr: IProduct[], m: any = []) => {
      if (arr.length === 0) {
        result.push(m);
      } else {
        for (let i = 0; i < arr.length; i++) {
          const curr = arr.slice();
          const next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next));
        }
      }
    };

    permute(arr);
    return result;
  }

  // Find the closest route by generating all permutations of the products
  // and calculating the distance between the locations
  private _findClosestRoute(products: IProduct[]) {
    let shortestDistance = Infinity;
    let closestRoute: ProductPosition[] = [];

    // Recursive function to find the closest route
    const findRouteHelper = (
      productIndex: number,
      currentPath: ProductPosition[],
      currentDistance: number,
      permutation: IProduct[]
    ) => {
      if (productIndex === permutation.length) {
        // All permutation have been visited
        if (currentDistance < shortestDistance) {
          shortestDistance = currentDistance;
          closestRoute = [...currentPath];
        }
        return;
      }

      const currentProduct = permutation[productIndex];

      currentProduct.locations.forEach((currentLocation) => {
        // Check if current location has required quantity
        if (currentLocation.quantity >= currentProduct.requiredQuantity) {
          // Calculate distance between current location and previous location
          let distance = 0;
          if (currentPath.length > 0) {
            const prevLocation = currentPath[currentPath.length - 1];
            distance = this._calculateDistance(prevLocation, currentLocation);
          }

          // Add current location to the path
          currentPath.push(currentLocation);

          // Call the function recursively
          findRouteHelper(
            productIndex + 1,
            currentPath,
            currentDistance + distance,
            permutation
          );

          // Remove current location from the path
          currentPath.pop();
        }
      });
    };

    // Generate all permutations
    const productPermutations = this._generatePermutations(products);

    // iterate through each permutation and find the closest route
    productPermutations.forEach((permutation) => {
      findRouteHelper(0, [], 0, permutation);
    });

    return new PickingOrder(closestRoute, shortestDistance);
  }

  async position(ctx: Context, params: searchParams): Promise<PickingOrder> {

    // Transform data to the format that is easier to work with
    const products: IProduct[] = [];
    for (const productId of params.ids) {
      const product = products.find((product) => product.id === productId);

      // If product is already in the list, increase the required quantity
      if (product) {
        product.requiredQuantity++;
      } else {

        // Get product locations by fetching data from the API
        const productLocations = await this.routing.getProductById(
          ctx,
          productId
        );

        products.push({
          id: productId,
          requiredQuantity: 1,
          locations: productLocations,
        });
      }
    }

    // Find the closest route
    const route = this._findClosestRoute(products);

    return route;
  }
}
