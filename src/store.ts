import { combineReducers, compose, applyMiddleware, createStore } from "redux";
import { createAction, handleActions } from "redux-actions";
import { ActionsObservable, combineEpics, createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";
import * as Rx from "rxjs";
import { navigationReducer } from "./navigation";

// Start margin state.

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

const marginCalculatorDefaultState: IMarginCalculator = {
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

export const RESET = "MarginCalculator/Reset";
export type RESET = typeof RESET;

export const RECALCULATE = "MarginCalculator/Recalculate";
export type RECALCULATE = typeof RESET;

export const UPDATE_COST_PRICE = "MarginCalculator/UpdateCostPrice";
export type UPDATE_COST_PRICE = typeof UPDATE_COST_PRICE;

export const UPDATE_COST_PRICE_CURRENCY = "MarginCalculator/UpdateCostPriceCurrency";
export type UPDATE_COST_PRICE_CURRENCY = typeof UPDATE_COST_PRICE_CURRENCY;

export const UPDATE_COST_PRICE_CURRENCY_VALUE = "MarginCalculator/UpdateCostPriceCurrencyValue";
export type UPDATE_COST_PRICE_CURRENCY_VALUE = typeof UPDATE_COST_PRICE_CURRENCY_VALUE;

export const UPDATE_SALE_PRICE = "MarginCalculator/UpdateSalePrice";
export type UPDATE_SALE_PRICE = typeof UPDATE_SALE_PRICE;

export const UPDATE_SALE_PRICE_CURRENCY = "MarginCalculator/UpdateSalePriceCurrency";
export type UPDATE_SALE_PRICE_CURRENCY = typeof UPDATE_SALE_PRICE_CURRENCY;

export const UPDATE_SALE_PRICE_CURRENCY_VALUE = "MarginCalculator/UpdateSalePriceCurrencyValue";
export type UPDATE_SALE_PRICE_CURRENCY_VALUE = typeof UPDATE_SALE_PRICE_CURRENCY_VALUE;

export const UPDATE_MARGIN = "MarginCalculator/UpdateMargin";
export type UPDATE_MARGIN = typeof UPDATE_MARGIN;

export const UPDATE_MARKUP = "MarginCalculator/UpdateMarkup";
export type UPDATE_MARKUP = typeof UPDATE_MARKUP;

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

export const marginCalculatorReducer = handleActions<IMarginCalculator, any>({
  [RESET]: (state, action) => {
    return marginCalculatorDefaultState;
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
}, marginCalculatorDefaultState);

// End margin state.

// Start currency state.

export interface ICurrencyRates {
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

const currencyRatesDefaultState: ICurrencyRates = {
  base: "GBP",
  date: "2017-08-22",
  rates: {},
};

export const RATES_REQUEST = "CurrencyRates/RatesRequest";
export type RATES_REQUEST = typeof RATES_REQUEST;

export const RATES_RESPONSE = "CurrencyRates/RatesResponse";
export type RATES_RESPONSE = typeof RATES_RESPONSE;

export const ratesRequest = createAction<void>(RATES_REQUEST);
export const ratesResponse = createAction<ICurrencyRates>(RATES_RESPONSE);

export const currencyRatesReducer = handleActions<ICurrencyRates>({
  [RATES_REQUEST]: (state, action) => {
    return state;
  },
  [RATES_RESPONSE]: (state, action) => {
    if (!!action.payload) {
      return action.payload;
    }
    return state;
  },
}, currencyRatesDefaultState);

export const ratesRequestEpic = (action$: ActionsObservable<any>) => {
  return action$.ofType(RATES_REQUEST)
    .mergeMap((action) => {
      const fetchPromise = fetch("http://api.fixer.io/latest?base=GBP", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
      return Rx.Observable.fromPromise(fetchPromise);
    })
    .mergeMap((response) => {
      if (response.ok && (response.status === 200)) {
        return Rx.Observable.fromPromise<ICurrencyRates>(response.json());
      }
      return Rx.Observable.of(currencyRatesDefaultState);
    })
    .map((data) => {
      return ratesResponse(data);
    });
};

export const currencyRatesEpic = combineEpics(
  ratesRequestEpic,
);

// End currency state.

export interface IStoreState {
  navigation: any;
  marginCalculator: IMarginCalculator;
  currencyRates: ICurrencyRates;
}

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

export function configureStore(initialState?: IStoreState) {
  const reducer = combineReducers({
    navigation: navigationReducer,
    marginCalculator: marginCalculatorReducer,
    currencyRates: currencyRatesReducer,
  });
  const epicMiddleware = createEpicMiddleware(currencyRatesEpic);
  const enhancer = compose(
    applyMiddleware(epicMiddleware),
    applyMiddleware(loggerMiddleware),
  );
  if (initialState != null) {
    return createStore(reducer, initialState, enhancer);
  } else {
    return createStore(reducer, enhancer);
  }
}
