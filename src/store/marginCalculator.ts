import { createAction, handleActions } from "redux-actions";

export interface IMarginCalculator {
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
    costPriceCurrencyValue: string;
    salePrice: string;
    salePriceCurrency: string;
    salePriceCurrencyValue: string;
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
  lastUpdate: string;
}

const explanations = {
  nothingHere: "Nothing here... awkward turtle-duck.",
  youDidThis: "You did this!",
};

function defaultState(): IMarginCalculator {
  return {
    data: {
      costPrice: 0,
      costPriceCurrency: 1,
      salePrice: 0,
      salePriceCurrency: 1,
      margin: 0,
      markup: 0,
      discount: 0,
    },
    display: {
      costPrice: "",
      costPriceCurrency: "GBP",
      costPriceCurrencyValue: "1.0000",
      salePrice: "",
      salePriceCurrency: "GBP",
      salePriceCurrencyValue: "1.0000",
      margin: "",
      markup: "",
      discount: "",
      discountedSalePrice: "",
      discountedMargin: "",
      discountedMarkup: "",
    },
    explain: {
      costPrice: explanations.nothingHere,
      salePrice: explanations.nothingHere,
      margin: explanations.nothingHere,
      markup: explanations.nothingHere,
      discount: explanations.nothingHere,
      discountedSalePrice: explanations.nothingHere,
      discountedMargin: explanations.nothingHere,
      discountedMarkup: explanations.nothingHere,
    },
    lastUpdate: "",
  };
}

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
  label?: string;
}

export const reset = createAction<void>(RESET);
export const recalculate = createAction<void>(RECALCULATE);
export const updateCostPrice = createAction<IUpdate>(UPDATE_COST_PRICE);
export const updateCostPriceCurrency = createAction<IUpdate>(UPDATE_COST_PRICE_CURRENCY);
export const updateCostPriceCurrencyValue = createAction<IUpdate>(UPDATE_COST_PRICE_CURRENCY_VALUE);
export const updateSalePrice = createAction<IUpdate>(UPDATE_SALE_PRICE);
export const updateSalePriceCurrency = createAction<IUpdate>(UPDATE_SALE_PRICE_CURRENCY);
export const updateSalePriceCurrencyValue = createAction<IUpdate>(UPDATE_SALE_PRICE_CURRENCY_VALUE);
export const updateMargin = createAction<IUpdate>(UPDATE_MARGIN);
export const updateMarkup = createAction<IUpdate>(UPDATE_MARKUP);
export const updateDiscount = createAction<IUpdate>(UPDATE_DISCOUNT);

function explainSalePriceFromMargin(state: IMarginCalculator): string {
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMargin = (state.data.margin / 100).toFixed(2);
  return `
  SalePrice = CostPrice / (1 - Margin)
  ${displaySalePrice} = ${displayCostPrice} / (1 - ${displayMargin})
  `;
}

function explainSalePriceFromMarkup(state: IMarginCalculator): string {
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMarkup = (state.data.markup / 100).toFixed(2);
  return `
  SalePrice = (CostPrice * Markup) + CostPrice
  ${displaySalePrice} = (${displayCostPrice} * ${displayMarkup}) + ${displayCostPrice}
  `;
}

function explainCostPriceFromMargin(state: IMarginCalculator): string {
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMargin = (state.data.margin / 100).toFixed(2);
  return `
  CostPrice = SalePrice - (SalePrice * Margin)
  ${displayCostPrice} = ${displaySalePrice} - (${displaySalePrice} * ${displayMargin})
  `;
}

function explainCostPriceFromMarkup(state: IMarginCalculator): string {
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayCostPrice = state.data.costPrice.toFixed(2);
  const displayMarkup = (state.data.markup / 100).toFixed(2);
  return `
  CostPrice = SalePrice / (Markup + 1)
  ${displayCostPrice} = ${displaySalePrice} / (${displayMarkup} + 1)
  `;
}

function explainMargin(state: IMarginCalculator, salePrice = state.data.salePrice): string {
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

function explainMarkup(state: IMarginCalculator, salePrice = state.data.salePrice): string {
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

function explainDiscountedSalePrice(state: IMarginCalculator, discountSalePrice: number): string {
  const displayDiscountedSalePrice = discountSalePrice.toFixed(2);
  const displaySalePrice = state.data.salePrice.toFixed(2);
  const displayDiscount = (state.data.discount / 100).toFixed(2);
  return `
  DiscountedSalePrice = SalePrice * (1 - Discount)
  ${displayDiscountedSalePrice} = ${displaySalePrice} * (1 - ${displayDiscount})
  `;
}

function recalculateMargin(state: IMarginCalculator): void {
  state.data.margin = ((state.data.salePrice - state.data.costPrice) / state.data.salePrice) * 100;
  state.display.margin = state.data.margin.toFixed(2);
  state.explain.margin = explainMargin(state);
}

function recalculateMarkup(state: IMarginCalculator): void {
  state.data.markup = ((state.data.salePrice - state.data.costPrice) / state.data.costPrice) * 100;
  state.display.markup = state.data.markup.toFixed(2);
  state.explain.markup = explainMarkup(state);
}

function recalculateSalePriceFromMargin(state: IMarginCalculator): void {
  state.data.salePrice = state.data.costPrice / (1 - (state.data.margin / 100));
  recalculateSalePriceCurrency(state);
  state.explain.salePrice = explainSalePriceFromMargin(state);
}

function recalculateSalePriceFromMarkup(state: IMarginCalculator): void {
  state.data.salePrice = (state.data.costPrice * (state.data.markup / 100)) + state.data.costPrice;
  recalculateSalePriceCurrency(state);
  state.explain.salePrice = explainSalePriceFromMarkup(state);
}

function recalculateCostPriceFromMargin(state: IMarginCalculator): void {
  state.data.costPrice = state.data.salePrice - ((state.data.margin / 100) * state.data.salePrice);
  recalculateCostPriceCurrency(state);
  state.explain.costPrice = explainCostPriceFromMargin(state);
}

function recalculateCostPriceFromMarkup(state: IMarginCalculator): void {
  state.data.costPrice = state.data.salePrice / ((state.data.markup / 100) + 1);
  recalculateCostPriceCurrency(state);
  state.explain.costPrice = explainCostPriceFromMarkup(state);
}

function recalculateSalePriceCurrency(state: IMarginCalculator): void {
  if (!!state.data.salePrice) {
    const salePriceInCurrency = state.data.salePrice * state.data.salePriceCurrency;
    state.display.salePrice = salePriceInCurrency.toFixed(2);
  }
}

function recalculateCostPriceCurrency(state: IMarginCalculator): void {
  if (!!state.data.costPrice) {
    const costPriceInCurrency = state.data.costPrice * state.data.costPriceCurrency;
    state.display.costPrice = costPriceInCurrency.toFixed(2);
  }
}

function recalculateDiscounted(state: IMarginCalculator): void {
  const discountedSalePrice = state.data.salePrice * (1 - (state.data.discount / 100));
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

function recalculateState(state: IMarginCalculator): IMarginCalculator {
  const newState = { ...state };

  switch (newState.lastUpdate) {
    case UPDATE_COST_PRICE: {
      newState.data.costPrice = parseFloat(state.display.costPrice);
      newState.explain.costPrice = explanations.youDidThis;

      if (!!newState.data.costPrice) {
        newState.data.costPrice = newState.data.costPrice * (1 / state.data.costPriceCurrency);

        if (!!newState.data.salePrice) {

          recalculateMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.data.margin) {

          recalculateSalePriceFromMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.data.markup) {

          recalculateSalePriceFromMarkup(newState);
          recalculateMargin(newState);

        }
      }
      break;
    }
    case UPDATE_COST_PRICE_CURRENCY: {
      newState.data.costPriceCurrency = parseFloat(state.display.costPriceCurrencyValue);

      if (!!newState.data.costPriceCurrency) {
        if (!!newState.data.salePrice) {
          if (!!newState.data.margin) {

            recalculateCostPriceFromMargin(newState);
            recalculateMarkup(newState);

          } else if (!!newState.data.markup) {

            recalculateCostPriceFromMarkup(newState);
            recalculateMargin(newState);

          }
        }

        recalculateCostPriceCurrency(newState);

      }
      break;
    }
    case UPDATE_SALE_PRICE: {
      newState.data.salePrice = parseFloat(state.display.salePrice);
      newState.explain.salePrice = explanations.youDidThis;

      if (!!newState.data.salePrice) {
        newState.data.salePrice = newState.data.salePrice * (1 / state.data.salePriceCurrency);

        if (!!newState.data.costPrice) {

          recalculateMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.data.margin) {

          recalculateCostPriceFromMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.data.markup) {

          recalculateCostPriceFromMarkup(newState);
          recalculateMargin(newState);

        }
      }
      break;
    }
    case UPDATE_SALE_PRICE_CURRENCY: {
      newState.data.salePriceCurrency = parseFloat(state.display.salePriceCurrencyValue);

      if (!!newState.data.salePriceCurrency) {
        if (!!newState.data.costPrice) {
          if (!!newState.data.margin) {

            recalculateSalePriceFromMargin(newState);
            recalculateMarkup(newState);

          } else if (!!newState.data.markup) {

            recalculateSalePriceFromMarkup(newState);
            recalculateMargin(newState);

          }
        }

        recalculateSalePriceCurrency(newState);

      }
      break;
    }
    case UPDATE_MARGIN: {
      newState.data.margin = parseFloat(state.display.margin);
      newState.explain.margin = explanations.youDidThis;

      if (!!newState.data.margin) {
        if (!!newState.data.costPrice) {

          recalculateSalePriceFromMargin(newState);
          recalculateMarkup(newState);

        } else if (!!newState.data.salePrice) {

          recalculateCostPriceFromMargin(newState);
          recalculateMarkup(newState);

        }
      }
      break;
    }
    case UPDATE_MARKUP: {
      newState.data.markup = parseFloat(state.display.markup);
      newState.explain.markup = explanations.youDidThis;

      if (!!newState.data.markup) {
        if (!!newState.data.costPrice) {

          recalculateSalePriceFromMarkup(newState);
          recalculateMargin(newState);

        } else if (!!newState.data.salePrice) {

          recalculateCostPriceFromMarkup(newState);
          recalculateMargin(newState);

        }
      }
      break;
    }
    case UPDATE_DISCOUNT: {
      newState.data.discount = parseFloat(state.display.discount);
      newState.explain.discount = explanations.youDidThis;
      break;
    }
  }

  if (!!newState.data.discount && !!newState.data.costPrice && !!newState.data.salePrice) {

    recalculateDiscounted(newState);

  }

  return newState;
}

export const reducer = handleActions<IMarginCalculator, IUpdate>({
  [RESET]: (state, action) => {
    return defaultState();
  },
  [RECALCULATE]: (state, action) => {
    return recalculateState(state);
  },
  [UPDATE_COST_PRICE]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        display: {
          ...state.display,
          costPrice: action.payload.value,
        },
        lastUpdate: UPDATE_COST_PRICE,
      };
    }
    return state;
  },
  [UPDATE_COST_PRICE_CURRENCY]: (state, action) => {
    if (!!action.payload && !!action.payload.label) {
      const newState = {
        ...state,
        display: {
          ...state.display,
          costPriceCurrency: action.payload.label,
          costPriceCurrencyValue: action.payload.value,
        },
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
        display: {
          ...state.display,
          costPriceCurrencyValue: action.payload.value,
        },
        lastUpdate: UPDATE_COST_PRICE_CURRENCY,
      };
    }
    return state;
  },
  [UPDATE_SALE_PRICE]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        display: {
          ...state.display,
          salePrice: action.payload.value,
        },
        lastUpdate: UPDATE_SALE_PRICE,
      };
    }
    return state;
  },
  [UPDATE_SALE_PRICE_CURRENCY]: (state, action) => {
    if (!!action.payload && !!action.payload.label) {
      const newState = {
        ...state,
        display: {
          ...state.display,
          salePriceCurrency: action.payload.label,
          salePriceCurrencyValue: action.payload.value,
        },
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
        display: {
          ...state.display,
          salePriceCurrencyValue: action.payload.value,
        },
        lastUpdate: UPDATE_SALE_PRICE_CURRENCY,
      };
    }
    return state;
  },
  [UPDATE_MARGIN]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        display: {
          ...state.display,
          margin: action.payload.value,
        },
        lastUpdate: UPDATE_MARGIN,
      };
    }
    return state;
  },
  [UPDATE_MARKUP]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        display: {
          ...state.display,
          markup: action.payload.value,
        },
        lastUpdate: UPDATE_MARKUP,
      };
    }
    return state;
  },
  [UPDATE_DISCOUNT]: (state, action) => {
    if (!!action.payload) {
      return {
        ...state,
        display: {
          ...state.display,
          discount: action.payload.value,
        },
        lastUpdate: UPDATE_DISCOUNT,
      };
    }
    return state;
  },
}, defaultState());
