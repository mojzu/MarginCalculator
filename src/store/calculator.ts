import { Action } from "@ngrx/store";

export interface IState {
  lastAction: string;
  data: {
    costPrice: number;
    costPriceCurrency: number;
    salePrice: number;
    salePriceCurrency: number;
    margin: number;
    markup: number;
    discount: number;
  };
  display: {
    costPrice: string;
    costPriceCurrency: string;
    costPriceCurrencyRate: string;
    salePrice: string;
    salePriceCurrency: string;
    salePriceCurrencyRate: string;
    margin: string;
    markup: string;
    discount: string;
    discountedSalePrice: string;
    discountedMargin: string;
    discountedMarkup: string;
  };
  explain: {
    costPrice: string;
    salePrice: string;
    margin: string;
    markup: string;
    discount: string;
    discountedSalePrice: string;
    discountedMargin: string;
    discountedMarkup: string;
  };
}

const explanations = {
  nothingHere: "Nothing here... awkward turtle-duck.",
  youDidThis: "You did this!"
};

export const initialState: IState = {
  lastAction: "",
  data: {
    costPrice: NaN,
    costPriceCurrency: 1,
    salePrice: NaN,
    salePriceCurrency: 1,
    margin: NaN,
    markup: NaN,
    discount: NaN
  },
  display: {
    costPrice: "",
    costPriceCurrency: "EUR",
    costPriceCurrencyRate: "1.0000",
    salePrice: "",
    salePriceCurrency: "EUR",
    salePriceCurrencyRate: "1.0000",
    margin: "",
    markup: "",
    discount: "",
    discountedSalePrice: "",
    discountedMargin: "",
    discountedMarkup: ""
  },
  explain: {
    costPrice: explanations.nothingHere,
    salePrice: explanations.nothingHere,
    margin: explanations.nothingHere,
    markup: explanations.nothingHere,
    discount: explanations.nothingHere,
    discountedSalePrice: explanations.nothingHere,
    discountedMargin: explanations.nothingHere,
    discountedMarkup: explanations.nothingHere
  }
};

export enum EActions {
  Reset = "Calculator/Reset",
  UpdateCostPrice = "Calculator/UpdateCostPrice",
  UpdateCostPriceCurrency = "Calculator/UpdateCostPriceCurrency",
  UpdateCostPriceCurrencyRate = "Calculator/UpdateCostPriceCurrencyRate",
  UpdateSalePrice = "Calculator/UpdateSalePrice",
  UpdateSalePriceCurrency = "Calculator/UpdateSalePriceCurrency",
  UpdateSalePriceCurrencyRate = "Calculator/UpdateSalePriceCurrencyRate",
  UpdateMargin = "Calculator/UpdateMargin",
  UpdateMarkup = "Calculator/UpdateMarkup",
  UpdateDiscount = "Calculator/UpdateDiscount"
}

export class Reset implements Action {
  public readonly type = EActions.Reset;
}

export interface IPayload {
  value: string;
  key?: string;
}

export class UpdateCostPrice implements Action {
  public readonly type = EActions.UpdateCostPrice;
  public constructor(public readonly payload: IPayload) {}
}

export class UpdateCostPriceCurrency implements Action {
  public readonly type = EActions.UpdateCostPriceCurrency;
  public constructor(public readonly payload: IPayload) {}
}

export class UpdateCostPriceCurrencyRate implements Action {
  public readonly type = EActions.UpdateCostPriceCurrencyRate;
  public constructor(public readonly payload: IPayload) {}
}

export class UpdateSalePrice implements Action {
  public readonly type = EActions.UpdateSalePrice;
  public constructor(public readonly payload: IPayload) {}
}

export class UpdateSalePriceCurrency implements Action {
  public readonly type = EActions.UpdateSalePriceCurrency;
  public constructor(public readonly payload: IPayload) {}
}

export class UpdateSalePriceCurrencyRate implements Action {
  public readonly type = EActions.UpdateSalePriceCurrencyRate;
  public constructor(public readonly payload: IPayload) {}
}

export class UpdateMargin implements Action {
  public readonly type = EActions.UpdateMargin;
  public constructor(public readonly payload: IPayload) {}
}

export class UpdateMarkup implements Action {
  public readonly type = EActions.UpdateMarkup;
  public constructor(public readonly payload: IPayload) {}
}

export class UpdateDiscount implements Action {
  public readonly type = EActions.UpdateDiscount;
  public constructor(public readonly payload: IPayload) {}
}

export type IActionsUnion =
  | Reset
  | UpdateCostPrice
  | UpdateCostPriceCurrency
  | UpdateCostPriceCurrencyRate
  | UpdateSalePrice
  | UpdateSalePriceCurrency
  | UpdateSalePriceCurrencyRate
  | UpdateMargin
  | UpdateMarkup
  | UpdateDiscount;

export function reducer(state: IState = initialState, action: IActionsUnion): IState {
  switch (action.type) {
    case EActions.Reset: {
      return {
        ...initialState,
        data: {
          ...initialState.data,
          costPriceCurrency: state.data.costPriceCurrency,
          salePriceCurrency: state.data.salePriceCurrency
        },
        display: {
          ...initialState.display,
          costPriceCurrency: state.display.costPriceCurrency,
          costPriceCurrencyRate: state.display.costPriceCurrencyRate,
          salePriceCurrency: state.display.salePriceCurrency,
          salePriceCurrencyRate: state.display.salePriceCurrencyRate
        }
      };
    }
    case EActions.UpdateCostPrice: {
      const nextState = {
        ...state,
        lastAction: EActions.UpdateCostPrice,
        display: { ...state.display, costPrice: action.payload.value }
      };
      return recalculateState(nextState);
    }
    case EActions.UpdateCostPriceCurrency: {
      if (action.payload.key != null) {
        const nextState = {
          ...state,
          lastAction: EActions.UpdateCostPriceCurrency,
          display: {
            ...state.display,
            costPriceCurrency: action.payload.key,
            costPriceCurrencyRate: action.payload.value
          }
        };
        return recalculateState(nextState);
      }
    }
    case EActions.UpdateCostPriceCurrencyRate: {
      const nextState = {
        ...state,
        lastAction: EActions.UpdateCostPriceCurrency,
        display: { ...state.display, costPriceCurrencyRate: action.payload.value }
      };
      return recalculateState(nextState);
    }
    case EActions.UpdateSalePrice: {
      const nextState = {
        ...state,
        lastAction: EActions.UpdateSalePrice,
        display: { ...state.display, salePrice: action.payload.value }
      };
      return recalculateState(nextState);
    }
    case EActions.UpdateSalePriceCurrency: {
      if (action.payload.key != null) {
        const nextState = {
          ...state,
          lastAction: EActions.UpdateSalePriceCurrency,
          display: {
            ...state.display,
            salePriceCurrency: action.payload.key,
            salePriceCurrencyRate: action.payload.value
          }
        };
        return recalculateState(nextState);
      }
    }
    case EActions.UpdateSalePriceCurrencyRate: {
      const nextState = {
        ...state,
        lastAction: EActions.UpdateSalePriceCurrency,
        display: { ...state.display, salePriceCurrencyRate: action.payload.value }
      };
      return recalculateState(nextState);
    }
    case EActions.UpdateMargin: {
      const nextState = {
        ...state,
        lastAction: EActions.UpdateMargin,
        display: { ...state.display, margin: action.payload.value }
      };
      return recalculateState(nextState);
    }
    case EActions.UpdateMarkup: {
      const nextState = {
        ...state,
        lastAction: EActions.UpdateMarkup,
        display: { ...state.display, markup: action.payload.value }
      };
      return recalculateState(nextState);
    }
    case EActions.UpdateDiscount: {
      const nextState = {
        ...state,
        lastAction: EActions.UpdateDiscount,
        display: { ...state.display, discount: action.payload.value }
      };
      return recalculateState(nextState);
    }
    default: {
      return { ...state };
    }
  }
}

function explainSalePriceFromMargin(state: IState): string {
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMargin = (state.data.margin / 100).toFixed(2);
  return `
  SalePrice = CostPrice / (1 - Margin)
  ${displaySalePrice} = ${displayCostPrice} / (1 - ${displayMargin})
  `;
}

function explainSalePriceFromMarkup(state: IState): string {
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMarkup = (state.data.markup / 100).toFixed(2);
  return `
  SalePrice = (CostPrice * Markup) + CostPrice
  ${displaySalePrice} = (${displayCostPrice} * ${displayMarkup}) + ${displayCostPrice}
  `;
}

function explainCostPriceFromMargin(state: IState): string {
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMargin = (state.data.margin / 100).toFixed(2);
  return `
  CostPrice = SalePrice - (SalePrice * Margin)
  ${displayCostPrice} = ${displaySalePrice} - (${displaySalePrice} * ${displayMargin})
  `;
}

function explainCostPriceFromMarkup(state: IState): string {
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMarkup = (state.data.markup / 100).toFixed(2);
  return `
  CostPrice = SalePrice / (Markup + 1)
  ${displayCostPrice} = ${displaySalePrice} / (${displayMarkup} + 1)
  `;
}

function explainMargin(state: IState, salePrice = state.data.salePrice): string {
  const profit = salePrice - state.data.costPrice;
  const displayProfit = profit.toFixed(2);
  const displaySalePrice = salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMargin = state.data.margin.toFixed(2);
  return `
  Profit = SalePrice - CostPrice
  ${displayProfit} = ${displaySalePrice} - ${displayCostPrice}

  Margin = (Profit / SalePrice) * 100
  ${displayMargin} = (${displayProfit} / ${displaySalePrice}) * 100
  `;
}

function explainMarkup(state: IState, salePrice = state.data.salePrice): string {
  const profit = salePrice - state.data.costPrice;
  const displayProfit = profit.toFixed(2);
  const displaySalePrice = salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMarkup = state.data.markup.toFixed(2);
  return `
  Profit = SalePrice - CostPrice
  ${displayProfit} = ${displaySalePrice} - ${displayCostPrice}

  Markup = (Profit / CostPrice) * 100
  ${displayMarkup} = (${displayProfit} / ${displayCostPrice}) * 100
  `;
}

function explainDiscountedSalePrice(state: IState, discountSalePrice: number): string {
  const displayDiscountedSalePrice = discountSalePrice.toFixed(2);
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayDiscount = (state.data.discount / 100).toFixed(2);
  return `
  DiscountedSalePrice = SalePrice * (1 - Discount)
  ${displayDiscountedSalePrice} = ${displaySalePrice} * (1 - ${displayDiscount})
  `;
}

function recalculateMargin(state: IState): void {
  state.data.margin = ((state.data.salePrice - state.data.costPrice) / state.data.salePrice) * 100;
  state.display.margin = state.data.margin.toFixed(2);
  state.explain.margin = explainMargin(state);
}

function recalculateMarkup(state: IState): void {
  state.data.markup = ((state.data.salePrice - state.data.costPrice) / state.data.costPrice) * 100;
  state.display.markup = state.data.markup.toFixed(2);
  state.explain.markup = explainMarkup(state);
}

function recalculateSalePriceFromMargin(state: IState): void {
  state.data.salePrice = state.data.costPrice / (1 - state.data.margin / 100);
  recalculateSalePriceCurrency(state);
  state.explain.salePrice = explainSalePriceFromMargin(state);
}

function recalculateSalePriceFromMarkup(state: IState): void {
  state.data.salePrice = state.data.costPrice * (state.data.markup / 100) + state.data.costPrice;
  recalculateSalePriceCurrency(state);
  state.explain.salePrice = explainSalePriceFromMarkup(state);
}

function recalculateCostPriceFromMargin(state: IState): void {
  state.data.costPrice = state.data.salePrice - (state.data.margin / 100) * state.data.salePrice;
  recalculateCostPriceCurrency(state);
  state.explain.costPrice = explainCostPriceFromMargin(state);
}

function recalculateCostPriceFromMarkup(state: IState): void {
  state.data.costPrice = state.data.salePrice / (state.data.markup / 100 + 1);
  recalculateCostPriceCurrency(state);
  state.explain.costPrice = explainCostPriceFromMarkup(state);
}

function recalculateSalePriceCurrency(state: IState): void {
  if (Number.isFinite(state.data.salePrice)) {
    const salePriceInCurrency = state.data.salePrice * state.data.salePriceCurrency;
    state.display.salePrice = salePriceInCurrency.toFixed(2);
  }
}

function recalculateCostPriceCurrency(state: IState): void {
  if (Number.isFinite(state.data.costPrice)) {
    const costPriceInCurrency = state.data.costPrice * state.data.costPriceCurrency;
    state.display.costPrice = costPriceInCurrency.toFixed(2);
  }
}

function recalculateDiscounted(state: IState): void {
  const discountedSalePrice = state.data.salePrice * (1 - state.data.discount / 100);
  const discountedSalePriceInCurrency = discountedSalePrice * state.data.salePriceCurrency;
  const discountedMargin = ((discountedSalePrice - state.data.costPrice) / discountedSalePrice) * 100;
  const discountedMarkup = ((discountedSalePrice - state.data.costPrice) / state.data.costPrice) * 100;

  state.display.discountedSalePrice = discountedSalePriceInCurrency.toFixed(2);
  state.explain.discountedSalePrice = explainDiscountedSalePrice(state, discountedSalePrice);
  state.display.discountedMargin = discountedMargin.toFixed(2);
  state.explain.discountedMargin = explainMargin(state, discountedSalePrice);
  state.display.discountedMarkup = discountedMarkup.toFixed(2);
  state.explain.discountedMarkup = explainMarkup(state, discountedSalePrice);
}

function recalculateState(state: IState): IState {
  const newState = { ...state };

  switch (newState.lastAction) {
    case EActions.UpdateCostPrice: {
      newState.data.costPrice = parseFloat(state.display.costPrice);
      newState.explain.costPrice = explanations.youDidThis;

      if (Number.isFinite(newState.data.costPrice)) {
        newState.data.costPrice = newState.data.costPrice * (1 / state.data.costPriceCurrency);

        if (Number.isFinite(newState.data.salePrice)) {
          recalculateMargin(newState);
          recalculateMarkup(newState);
        } else if (Number.isFinite(newState.data.margin)) {
          recalculateSalePriceFromMargin(newState);
          recalculateMarkup(newState);
        } else if (Number.isFinite(newState.data.markup)) {
          recalculateSalePriceFromMarkup(newState);
          recalculateMargin(newState);
        }
      }
      break;
    }
    case EActions.UpdateCostPriceCurrency: {
      newState.data.costPriceCurrency = parseFloat(state.display.costPriceCurrencyRate);

      if (Number.isFinite(newState.data.costPriceCurrency)) {
        if (Number.isFinite(newState.data.salePrice)) {
          if (Number.isFinite(newState.data.margin)) {
            recalculateCostPriceFromMargin(newState);
            recalculateMarkup(newState);
          } else if (Number.isFinite(newState.data.markup)) {
            recalculateCostPriceFromMarkup(newState);
            recalculateMargin(newState);
          }
        }

        recalculateCostPriceCurrency(newState);
      }
      break;
    }
    case EActions.UpdateSalePrice: {
      newState.data.salePrice = parseFloat(state.display.salePrice);
      newState.explain.salePrice = explanations.youDidThis;

      if (Number.isFinite(newState.data.salePrice)) {
        newState.data.salePrice = newState.data.salePrice * (1 / state.data.salePriceCurrency);

        if (Number.isFinite(newState.data.costPrice)) {
          recalculateMargin(newState);
          recalculateMarkup(newState);
        } else if (Number.isFinite(newState.data.margin)) {
          recalculateCostPriceFromMargin(newState);
          recalculateMarkup(newState);
        } else if (Number.isFinite(newState.data.markup)) {
          recalculateCostPriceFromMarkup(newState);
          recalculateMargin(newState);
        }
      }
      break;
    }
    case EActions.UpdateSalePriceCurrency: {
      newState.data.salePriceCurrency = parseFloat(state.display.salePriceCurrencyRate);

      if (Number.isFinite(newState.data.salePriceCurrency)) {
        if (Number.isFinite(newState.data.costPrice)) {
          if (Number.isFinite(newState.data.margin)) {
            recalculateSalePriceFromMargin(newState);
            recalculateMarkup(newState);
          } else if (Number.isFinite(newState.data.markup)) {
            recalculateSalePriceFromMarkup(newState);
            recalculateMargin(newState);
          }
        }

        recalculateSalePriceCurrency(newState);
      }
      break;
    }
    case EActions.UpdateMargin: {
      newState.data.margin = parseFloat(state.display.margin);
      newState.explain.margin = explanations.youDidThis;

      if (Number.isFinite(newState.data.margin)) {
        if (Number.isFinite(newState.data.costPrice)) {
          recalculateSalePriceFromMargin(newState);
          recalculateMarkup(newState);
        } else if (Number.isFinite(newState.data.salePrice)) {
          recalculateCostPriceFromMargin(newState);
          recalculateMarkup(newState);
        }
      }
      break;
    }
    case EActions.UpdateMarkup: {
      newState.data.markup = parseFloat(state.display.markup);
      newState.explain.markup = explanations.youDidThis;

      if (Number.isFinite(newState.data.markup)) {
        if (Number.isFinite(newState.data.costPrice)) {
          recalculateSalePriceFromMarkup(newState);
          recalculateMargin(newState);
        } else if (Number.isFinite(newState.data.salePrice)) {
          recalculateCostPriceFromMarkup(newState);
          recalculateMargin(newState);
        }
      }
      break;
    }
    case EActions.UpdateDiscount: {
      newState.data.discount = parseFloat(state.display.discount);
      newState.explain.discount = explanations.youDidThis;
      break;
    }
  }

  if (
    Number.isFinite(newState.data.discount) &&
    Number.isFinite(newState.data.costPrice) &&
    Number.isFinite(newState.data.salePrice)
  ) {
    recalculateDiscounted(newState);
  }

  return newState;
}
