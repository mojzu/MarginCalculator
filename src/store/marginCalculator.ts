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
  costPrice: number;
  costPriceCurrency: number;
  salePrice: number;
  salePriceCurrency: number;
  margin: number;
  markup: number;
  lastUpdate: string;
}

const defaultState: IMarginCalculator = {
  displayCostPrice: "",
  displayCostPriceCurrency: "GBP",
  displayCostPriceCurrencyValue: "1.0000",
  displaySalePrice: "",
  displaySalePriceCurrency: "GBP",
  displaySalePriceCurrencyValue: "1.0000",
  displayMargin: "",
  displayMarkup: "",
  costPrice: 0,
  costPriceCurrency: 1,
  salePrice: 0,
  salePriceCurrency: 1,
  margin: 0,
  markup: 0,
  lastUpdate: "",
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

function recalculateMargin(state: IMarginCalculator): void {
  state.margin = ((state.salePrice - state.costPrice) / state.salePrice) * 100;
  state.displayMargin = state.margin.toFixed(2);
}

function recalculateMarkup(state: IMarginCalculator): void {
  state.markup = ((state.salePrice / state.costPrice) * 100) - 100;
  state.displayMarkup = state.markup.toFixed(2);
}

function recalculateSalePriceFromMargin(state: IMarginCalculator): void {
  state.salePrice = state.costPrice / (1 - (state.margin / 100));
  recalculateSalePriceCurrency(state);
}

function recalculateSalePriceFromMarkup(state: IMarginCalculator): void {
  state.salePrice = (state.costPrice * (state.markup / 100)) + state.costPrice;
  recalculateSalePriceCurrency(state);
}

function recalculateCostPriceFromMargin(state: IMarginCalculator): void {
  state.costPrice = state.salePrice - ((state.margin / 100) * state.salePrice);
  recalculateCostPriceCurrency(state);
}

function recalculateCostPriceFromMarkup(state: IMarginCalculator): void {
  state.costPrice = state.salePrice / ((state.markup + 100) / 100);
  recalculateCostPriceCurrency(state);
}

function recalculateSalePriceCurrency(state: IMarginCalculator): void {
  if (!!state.salePrice) {
    const salePriceInCurrency = state.salePrice * (state.salePriceCurrency / state.costPriceCurrency);
    state.displaySalePrice = salePriceInCurrency.toFixed(2);
  }
}

function recalculateCostPriceCurrency(state: IMarginCalculator): void {
  if (!!state.costPrice) {
    const costPriceInCurrency = state.costPrice * (state.costPriceCurrency / state.salePriceCurrency);
    state.displayCostPrice = costPriceInCurrency.toFixed(2);
  }
}

function recalculateState(state: IMarginCalculator): IMarginCalculator {
  const newState = {
    ...state,
    costPrice: parseFloat(state.displayCostPrice),
    costPriceCurrency: parseFloat(state.displayCostPriceCurrencyValue),
    salePrice: parseFloat(state.displaySalePrice),
    salePriceCurrency: parseFloat(state.displaySalePriceCurrencyValue),
    margin: parseFloat(state.displayMargin),
    markup: parseFloat(state.displayMarkup),
  };

  if (!!newState.costPrice && (newState.lastUpdate === UPDATE_COST_PRICE)) {
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
  } else if (!!newState.salePrice && (newState.lastUpdate === UPDATE_SALE_PRICE)) {
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
  } else if (!!newState.margin && (newState.lastUpdate === UPDATE_MARGIN)) {
    if (!!newState.costPrice) {

      recalculateSalePriceFromMargin(newState);
      recalculateMarkup(newState);

    } else if (!!newState.salePrice) {

      recalculateCostPriceFromMargin(newState);
      recalculateMarkup(newState);

    }
  } else if (!!newState.markup && (newState.lastUpdate === UPDATE_MARKUP)) {
    if (!!newState.costPrice) {

      recalculateSalePriceFromMarkup(newState);
      recalculateMargin(newState);

    } else if (!!newState.salePrice) {

      recalculateCostPriceFromMarkup(newState);
      recalculateMargin(newState);

    }
  } else if (!!newState.costPriceCurrency && (newState.lastUpdate === UPDATE_COST_PRICE_CURRENCY)) {
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

  } else if (!!newState.salePriceCurrency && (newState.lastUpdate === UPDATE_SALE_PRICE_CURRENCY)) {
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
}, defaultState);
