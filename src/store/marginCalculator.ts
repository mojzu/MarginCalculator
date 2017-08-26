import { createAction, handleActions } from "redux-actions";

export interface IMarginCalculator {
  displayCostPrice: string;
  displayCostPriceCurrency: string;
  displayCostPriceCurrencyValue: string;
  displaySalePrice: string;
  displaySalePriceCurrency: string;
  displaySalePriceCurrencyValue: string;
  displayMargin: string;
  displayMarkup: string;
  displayDiscount: string;
  costPrice: number;
  costPriceCurrency: number;
  salePrice: number;
  salePriceCurrency: number;
  margin: number;
  markup: number;
  discount: number;
  lastUpdate: string;
  explain: {
    costPrice: string;
    salePrice: string;
    margin: string;
    markup: string;
    discount: string;
  };
}

const commonExplanations = {
  nothingHere: "Nothing here... awkward turtle-duck.",
  youDidThis: "You did this!",
};

const defaultState: IMarginCalculator = {
  displayCostPrice: "",
  displayCostPriceCurrency: "GBP",
  displayCostPriceCurrencyValue: "1.0000",
  displaySalePrice: "",
  displaySalePriceCurrency: "GBP",
  displaySalePriceCurrencyValue: "1.0000",
  displayMargin: "",
  displayMarkup: "",
  displayDiscount: "",
  costPrice: 0,
  costPriceCurrency: 1,
  salePrice: 0,
  salePriceCurrency: 1,
  margin: 0,
  markup: 0,
  discount: 0,
  lastUpdate: "",
  explain: {
    costPrice: commonExplanations.nothingHere,
    salePrice: commonExplanations.nothingHere,
    margin: commonExplanations.nothingHere,
    markup: commonExplanations.nothingHere,
    discount: commonExplanations.nothingHere,
  },
};

const RESET = "MarginCalculator/Reset";
type RESET = typeof RESET;

const RECALCULATE = "MarginCalculator/Recalculate";
type RECALCULATE = typeof RESET;

const UPDATE_COST_PRICE = "MarginCalculator/UpdateCostPrice";
type UPDATE_COST_PRICE = typeof UPDATE_COST_PRICE;

const UPDATE_COST_PRICE_CURRENCY = "MarginCalculator/UpdateCostPriceCurrency";
type UPDATE_COST_PRICE_CURRENCY = typeof UPDATE_COST_PRICE_CURRENCY;

const UPDATE_COST_PRICE_CURRENCY_VALUE = "MarginCalculator/UpdateCostPriceCurrencyValue";
type UPDATE_COST_PRICE_CURRENCY_VALUE = typeof UPDATE_COST_PRICE_CURRENCY_VALUE;

const UPDATE_SALE_PRICE = "MarginCalculator/UpdateSalePrice";
type UPDATE_SALE_PRICE = typeof UPDATE_SALE_PRICE;

const UPDATE_SALE_PRICE_CURRENCY = "MarginCalculator/UpdateSalePriceCurrency";
type UPDATE_SALE_PRICE_CURRENCY = typeof UPDATE_SALE_PRICE_CURRENCY;

const UPDATE_SALE_PRICE_CURRENCY_VALUE = "MarginCalculator/UpdateSalePriceCurrencyValue";
type UPDATE_SALE_PRICE_CURRENCY_VALUE = typeof UPDATE_SALE_PRICE_CURRENCY_VALUE;

const UPDATE_MARGIN = "MarginCalculator/UpdateMargin";
type UPDATE_MARGIN = typeof UPDATE_MARGIN;

const UPDATE_MARKUP = "MarginCalculator/UpdateMarkup";
type UPDATE_MARKUP = typeof UPDATE_MARKUP;

const UPDATE_DISCOUNT = "MarginCalculator/UpdateDiscount";
type UPDATE_DISCOUNT = typeof UPDATE_DISCOUNT;

export interface IUpdate {
  value: string;
}

export interface IUpdateCurrency {
  label: string;
  value: string;
}

export const reset = createAction<void>(RESET);
export const recalculate = createAction<void>(RECALCULATE);
export const updateCostPrice = createAction<IUpdate>(UPDATE_COST_PRICE);
export const updateCostPriceCurrency = createAction<IUpdateCurrency>(UPDATE_COST_PRICE_CURRENCY);
export const updateCostPriceCurrencyValue = createAction<IUpdate>(UPDATE_COST_PRICE_CURRENCY_VALUE);
export const updateSalePrice = createAction<IUpdate>(UPDATE_SALE_PRICE);
export const updateSalePriceCurrency = createAction<IUpdateCurrency>(UPDATE_SALE_PRICE_CURRENCY);
export const updateSalePriceCurrencyValue = createAction<IUpdate>(UPDATE_SALE_PRICE_CURRENCY_VALUE);
export const updateMargin = createAction<IUpdate>(UPDATE_MARGIN);
export const updateMarkup = createAction<IUpdate>(UPDATE_MARKUP);
export const updateDiscount = createAction<IUpdate>(UPDATE_DISCOUNT);

function discountSalePrice(state: IMarginCalculator): number {
  if (!!state.discount) {
    return state.salePrice * (1 - (state.discount / 100));
  }
  return state.salePrice;
}

// TODO: Improve explanations with currency, discount handling.

function explainSalePriceFromMargin(state: IMarginCalculator): string {
  const displaySalePrice = state.salePrice.toFixed(2);
  const displayCostPrice = state.costPrice.toFixed(2);
  const displayMargin = (state.margin / 100).toFixed(2);
  return `
  SalePrice = CostPrice / (1 - Margin)
  ${displaySalePrice} = ${displayCostPrice} / (1 - ${displayMargin})
  `;
}

function explainSalePriceFromMarkup(state: IMarginCalculator): string {
  const displaySalePrice = state.salePrice.toFixed(2);
  const displayCostPrice = state.costPrice.toFixed(2);
  const displayMarkup = (state.markup / 100).toFixed(2);
  return `
  SalePrice = (CostPrice * Markup) + CostPrice
  ${displaySalePrice} = (${displayCostPrice} * ${displayMarkup}) + ${displayCostPrice}
  `;
}

function explainCostPriceFromMargin(state: IMarginCalculator): string {
  const displaySalePrice = state.salePrice.toFixed(2);
  const displayCostPrice = state.costPrice.toFixed(2);
  const displayMargin = (state.margin / 100).toFixed(2);

  return `
  CostPrice = SalePrice - (SalePrice * Margin)
  ${displayCostPrice} = ${displaySalePrice} - (${displaySalePrice} * ${displayMargin})
  `;
}

function explainCostPriceFromMarkup(state: IMarginCalculator): string {
  const displaySalePrice = state.salePrice.toFixed(2);
  const displayCostPrice = state.costPrice.toFixed(2);
  const displayMarkup = (state.markup / 100).toFixed(2);
  return `
  CostPrice = SalePrice / (Markup + 1)
  ${displayCostPrice} = ${displaySalePrice} / (${displayMarkup} + 1)
  `;
}

function explainMargin(state: IMarginCalculator): string {
  const salePrice = discountSalePrice(state);
  const profit = salePrice - state.costPrice;
  const displayProfit = profit.toFixed(2);
  const displaySalePrice = salePrice.toFixed(2);
  const displayCostPrice = state.costPrice.toFixed(2);
  const displayMargin = state.margin.toFixed(2);
  return `
  Profit = SalePrice - CostPrice
  ${displayProfit} = ${displaySalePrice} - ${displayCostPrice}

  Margin = (Profit / SalePrice) * 100
  ${displayMargin} = (${displayProfit} / ${displaySalePrice}) * 100
  `;
}

function explainMarkup(state: IMarginCalculator): string {
  const salePrice = discountSalePrice(state);
  const profit = salePrice - state.costPrice;

  const displayProfit = profit.toFixed(2);
  const displaySalePrice = salePrice.toFixed(2);
  const displayCostPrice = state.costPrice.toFixed(2);
  const displayMarkup = state.markup.toFixed(2);

  return `
  Profit = SalePrice - CostPrice
  ${displayProfit} = ${displaySalePrice} - ${displayCostPrice}

  Markup = (Profit / CostPrice) * 100
  ${displayMarkup} = (${displayProfit} / ${displayCostPrice}) * 100
  `;
}

function recalculateMargin(state: IMarginCalculator): void {
  const salePrice = discountSalePrice(state);
  state.margin = ((salePrice - state.costPrice) / salePrice) * 100;
  state.displayMargin = state.margin.toFixed(2);
  state.explain.margin = explainMargin(state);
}

function recalculateMarkup(state: IMarginCalculator): void {
  const salePrice = discountSalePrice(state);
  state.markup = ((salePrice - state.costPrice) / state.costPrice) * 100;
  state.displayMarkup = state.markup.toFixed(2);
  state.explain.markup = explainMarkup(state);
}

function recalculateSalePriceFromMargin(state: IMarginCalculator): void {
  state.salePrice = state.costPrice / (1 - (state.margin / 100));
  recalculateSalePriceCurrency(state);
  state.explain.salePrice = explainSalePriceFromMargin(state);
}

function recalculateSalePriceFromMarkup(state: IMarginCalculator): void {
  state.salePrice = (state.costPrice * (state.markup / 100)) + state.costPrice;
  recalculateSalePriceCurrency(state);
  state.explain.salePrice = explainSalePriceFromMarkup(state);
}

function recalculateCostPriceFromMargin(state: IMarginCalculator): void {
  const salePrice = discountSalePrice(state);
  state.costPrice = salePrice - ((state.margin / 100) * salePrice);
  recalculateCostPriceCurrency(state);
  state.explain.costPrice = explainCostPriceFromMargin(state);
}

function recalculateCostPriceFromMarkup(state: IMarginCalculator): void {
  const salePrice = discountSalePrice(state);
  state.costPrice = salePrice / ((state.markup / 100) + 1);
  recalculateCostPriceCurrency(state);
  state.explain.costPrice = explainCostPriceFromMarkup(state);
}

function recalculateSalePriceCurrency(state: IMarginCalculator): void {
  if (!!state.salePrice) {
    const salePrice = discountSalePrice(state);
    const salePriceInCurrency = salePrice * state.salePriceCurrency;
    state.displaySalePrice = salePriceInCurrency.toFixed(2);
  }
}

function recalculateCostPriceCurrency(state: IMarginCalculator): void {
  if (!!state.costPrice) {
    const costPriceInCurrency = state.costPrice * state.costPriceCurrency;
    state.displayCostPrice = costPriceInCurrency.toFixed(2);
  }
}

function recalculateState(state: IMarginCalculator): IMarginCalculator {
  const newState = { ...state };

  switch (newState.lastUpdate) {
    case UPDATE_COST_PRICE: {
      newState.costPrice = parseFloat(state.displayCostPrice);
      newState.explain.costPrice = commonExplanations.youDidThis;

      if (!!newState.costPrice) {
        // Convert to base currency value.
        newState.costPrice = newState.costPrice * (1 / state.costPriceCurrency);

        if (!!newState.salePrice) {

          recalculateMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.margin) {

          recalculateSalePriceFromMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.markup) {

          recalculateSalePriceFromMarkup(newState);
          recalculateMargin(newState);

        }
      }
      break;
    }
    case UPDATE_COST_PRICE_CURRENCY: {
      newState.costPriceCurrency = parseFloat(state.displayCostPriceCurrencyValue);
      if (!!newState.costPriceCurrency) {
        if (!!newState.salePrice) {
          if (!!newState.margin) {

            recalculateCostPriceFromMargin(newState);
            recalculateMarkup(newState);

          } else if (!!newState.markup) {

            recalculateCostPriceFromMarkup(newState);
            recalculateMargin(newState);

          }
        }

        recalculateCostPriceCurrency(newState);

      }
      break;
    }
    case UPDATE_SALE_PRICE: {
      newState.salePrice = parseFloat(state.displaySalePrice);
      newState.explain.salePrice = commonExplanations.youDidThis;

      if (!!newState.salePrice) {
        // Convert to base currency value.
        newState.salePrice = newState.salePrice * (1 / state.salePriceCurrency);

        if (!!newState.costPrice) {

          recalculateMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.margin) {

          recalculateCostPriceFromMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.markup) {

          recalculateCostPriceFromMarkup(newState);
          recalculateMargin(newState);

        }
      }
      break;
    }
    case UPDATE_SALE_PRICE_CURRENCY: {
      newState.salePriceCurrency = parseFloat(state.displaySalePriceCurrencyValue);
      if (!!newState.salePriceCurrency) {
        if (!!newState.costPrice) {
          if (!!newState.margin) {

            recalculateSalePriceFromMargin(newState);
            recalculateMarkup(newState);

          } else if (!!newState.markup) {

            recalculateSalePriceFromMarkup(newState);
            recalculateMargin(newState);

          }
        }

        recalculateSalePriceCurrency(newState);

      }
      break;
    }
    case UPDATE_MARGIN: {
      newState.margin = parseFloat(state.displayMargin);
      newState.explain.margin = commonExplanations.youDidThis;

      if (!!newState.margin) {
        if (!!newState.costPrice) {

          recalculateSalePriceFromMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.salePrice) {

          recalculateCostPriceFromMargin(newState);
          recalculateMarkup(newState);

        }
      }
      break;
    }
    case UPDATE_MARKUP: {
      newState.markup = parseFloat(state.displayMarkup);
      newState.explain.markup = commonExplanations.youDidThis;

      if (!!newState.markup) {
        if (!!newState.costPrice) {

          recalculateSalePriceFromMarkup(newState);
          recalculateMargin(newState);

        } else if (!!newState.salePrice) {

          recalculateCostPriceFromMarkup(newState);
          recalculateMargin(newState);

        }
      }
      break;
    }
    case UPDATE_DISCOUNT: {
      newState.discount = parseFloat(state.displayDiscount);
      newState.explain.discount = commonExplanations.youDidThis;

      if (!!newState.costPrice && !!newState.salePrice) {

        recalculateMargin(newState);
        recalculateMarkup(newState);
        recalculateSalePriceCurrency(newState);

      }
      break;
    }
  }

  return newState;
}

export const reducer = handleActions<IMarginCalculator, any>({
  [RESET]: (state, action) => {
    return defaultState;
  },
  [RECALCULATE]: (state, action) => {
    return recalculateState(state);
  },
  [UPDATE_COST_PRICE]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        displayCostPrice: action.payload.value,
        lastUpdate: UPDATE_COST_PRICE,
      };
    }
    return state;
  },
  [UPDATE_COST_PRICE_CURRENCY]: (state, action) => {
    if (!!action.payload) {
      const newState = {
        ...state,
        displayCostPriceCurrency: action.payload.label,
        displayCostPriceCurrencyValue: action.payload.value,
        lastUpdate: UPDATE_COST_PRICE_CURRENCY,
      };
      return recalculateState(newState);
    }
    return state;
  },
  [UPDATE_COST_PRICE_CURRENCY_VALUE]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        displayCostPriceCurrencyValue: action.payload.value,
        lastUpdate: UPDATE_COST_PRICE_CURRENCY,
      };
    }
    return state;
  },
  [UPDATE_SALE_PRICE]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        displaySalePrice: action.payload.value,
        lastUpdate: UPDATE_SALE_PRICE,
      };
    }
    return state;
  },
  [UPDATE_SALE_PRICE_CURRENCY]: (state, action) => {
    if (!!action.payload) {
      const newState = {
        ...state,
        displaySalePriceCurrency: action.payload.label,
        displaySalePriceCurrencyValue: action.payload.value,
        lastUpdate: UPDATE_SALE_PRICE_CURRENCY,
      };
      return recalculateState(newState);
    }
    return state;
  },
  [UPDATE_SALE_PRICE_CURRENCY_VALUE]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        displaySalePriceCurrencyValue: action.payload.value,
        lastUpdate: UPDATE_SALE_PRICE_CURRENCY,
      };
    }
    return state;
  },
  [UPDATE_MARGIN]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        displayMargin: action.payload.value,
        lastUpdate: UPDATE_MARGIN,
      };
    }
    return state;
  },
  [UPDATE_MARKUP]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        displayMarkup: action.payload.value,
        lastUpdate: UPDATE_MARKUP,
      };
    }
    return state;
  },
  [UPDATE_DISCOUNT]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        displayDiscount: action.payload.value,
        lastUpdate: UPDATE_DISCOUNT,
      };
    }
    return state;
  },
}, defaultState);
