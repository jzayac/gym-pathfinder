export class ProductPosition {
  constructor(
    public productId: string,
    public positionId: string,
    public x: number,
    public y: number,
    public z: number,
    public quantity: number
  ) {}
}

export class PickingOrder {
  constructor(
    public pickingOrder: ProductPosition[],
    public distance: number
  ) {}

  public normalizeJSON() {
    return {
      pickingOrder: this.pickingOrder.map((item) => {
        return {
          productId: item.productId,
          positionId: item.positionId,
        };
      }),
      distance: this.distance,
    };
  }
}
