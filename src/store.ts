import { combineReducers, compose, applyMiddleware, createStore } from "redux";
import { createAction, handleActions } from "redux-actions";
import { createLogger } from "redux-logger";
import { navigationReducer } from "./navigation";

// Start margin state.

export interface IMarginCalculator {
  displayCostPrice: string;
  displaySalePrice: string;
  displayMargin: string;
  displayMarkup: string;
  costPrice: number;
  salePrice: number;
  margin: number;
  markup: number;
  lastUpdate: string;
}

const marginDefaultState: IMarginCalculator = {
  displayCostPrice: "",
  displaySalePrice: "",
  displayMargin: "",
  displayMarkup: "",
  costPrice: 0,
  salePrice: 0,
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

export const UPDATE_SALE_PRICE = "MarginCalculator/UpdateSalePrice";
export type UPDATE_SALE_PRICE = typeof UPDATE_SALE_PRICE;

export const UPDATE_MARGIN = "MarginCalculator/UpdateMargin";
export type UPDATE_MARGIN = typeof UPDATE_MARGIN;

export const UPDATE_MARKUP = "MarginCalculator/UpdateMarkup";
export type UPDATE_MARKUP = typeof UPDATE_MARKUP;

export interface IUpdate {
  value: string;
}

export const reset = createAction<void>(RESET);
export const recalculate = createAction<void>(RECALCULATE);
export const updateCostPrice = createAction<IUpdate>(UPDATE_COST_PRICE);
export const updateSalePrice = createAction<IUpdate>(UPDATE_SALE_PRICE);
export const updateMargin = createAction<IUpdate>(UPDATE_MARGIN);
export const updateMarkup = createAction<IUpdate>(UPDATE_MARKUP);

export const marginReducer = handleActions<IMarginCalculator, IUpdate>({
  [RESET]: (state, action) => {
    return marginDefaultState;
  },
  [RECALCULATE]: (state, action) => {

    const newState = {
      ...state,
      costPrice: parseFloat(state.displayCostPrice),
      salePrice: parseFloat(state.displaySalePrice),
      margin: parseFloat(state.displayMargin),
      markup: parseFloat(state.displayMarkup),
    };

    // Start calculation.

    if (!!newState.costPrice && (newState.lastUpdate === UPDATE_COST_PRICE)) {
      if (!!newState.salePrice) {

        newState.margin = ((newState.salePrice - newState.costPrice) / newState.salePrice) * 100;
        newState.displayMargin = newState.margin.toFixed(2);
        newState.markup = ((newState.salePrice / newState.costPrice) * 100) - 100;
        newState.displayMarkup = newState.markup.toFixed(2);

      } else if (!!newState.margin) {

        newState.salePrice = newState.costPrice / (1 - (newState.margin / 100));
        newState.displaySalePrice = newState.salePrice.toFixed(2);
        newState.markup = ((newState.salePrice / newState.costPrice) * 100) - 100;
        newState.displayMarkup = newState.markup.toFixed(2);

      } else if (!!newState.markup) {

        newState.salePrice = (newState.costPrice * (newState.markup / 100)) + newState.costPrice;
        newState.displaySalePrice = newState.salePrice.toFixed(2);
        newState.margin = ((newState.salePrice - newState.costPrice) / newState.salePrice) * 100;
        newState.displayMargin = newState.margin.toFixed(2);

      }
    } else if (!!newState.salePrice && (newState.lastUpdate === UPDATE_SALE_PRICE)) {
      if (!!newState.costPrice) {

        newState.margin = ((newState.salePrice - newState.costPrice) / newState.salePrice) * 100;
        newState.displayMargin = newState.margin.toFixed(2);
        newState.markup = ((newState.salePrice / newState.costPrice) * 100) - 100;
        newState.displayMarkup = newState.markup.toFixed(2);

      } else if (!!newState.margin) {

        newState.costPrice = newState.salePrice - ((newState.margin / 100) * newState.salePrice);
        newState.displayCostPrice = newState.costPrice.toFixed(2);
        newState.markup = ((newState.salePrice / newState.costPrice) * 100) - 100;
        newState.displayMarkup = newState.markup.toFixed(2);

      } else if (!!newState.markup) {

        newState.costPrice = newState.salePrice / ((newState.markup + 100) / 100);
        newState.displayCostPrice = newState.costPrice.toFixed(2);
        newState.margin = ((newState.salePrice - newState.costPrice) / newState.salePrice) * 100;
        newState.displayMargin = newState.margin.toFixed(2);

      }
    } else if (!!newState.margin && (newState.lastUpdate === UPDATE_MARGIN)) {
      if (!!newState.costPrice) {

        newState.salePrice = newState.costPrice / (1 - (newState.margin / 100));
        newState.displaySalePrice = newState.salePrice.toFixed(2);
        newState.markup = ((newState.salePrice / newState.costPrice) * 100) - 100;
        newState.displayMarkup = newState.markup.toFixed(2);

      } else if (!!newState.salePrice) {

        newState.costPrice = newState.salePrice - ((newState.margin / 100) * newState.salePrice);
        newState.displayCostPrice = newState.costPrice.toFixed(2);
        newState.markup = ((newState.salePrice / newState.costPrice) * 100) - 100;
        newState.displayMarkup = newState.markup.toFixed(2);

      }
    } else if (!!newState.markup && (newState.lastUpdate === UPDATE_MARKUP)) {
      if (!!newState.costPrice) {

        newState.salePrice = (newState.costPrice * (newState.markup / 100)) + newState.costPrice;
        newState.displaySalePrice = newState.salePrice.toFixed(2);
        newState.margin = ((newState.salePrice - newState.costPrice) / newState.salePrice) * 100;
        newState.displayMargin = newState.margin.toFixed(2);

      } else if (!!newState.salePrice) {

        newState.costPrice = newState.salePrice / ((newState.markup + 100) / 100);
        newState.displayCostPrice = newState.costPrice.toFixed(2);
        newState.margin = ((newState.salePrice - newState.costPrice) / newState.salePrice) * 100;
        newState.displayMargin = newState.margin.toFixed(2);

      }
    }

    // End calculation.

    return newState;
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
}, marginDefaultState);

// End margin state.

export interface IStoreState {
  navigation: any;
  marginCalculator: IMarginCalculator;
}

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

export function configureStore(initialState?: IStoreState) {
  const reducer = combineReducers({
    navigation: navigationReducer,
    marginCalculator: marginReducer,
  });
  const enhancer = compose(
    applyMiddleware(loggerMiddleware),
  );
  if (initialState != null) {
    return createStore(reducer, initialState, enhancer);
  } else {
    return createStore(reducer, enhancer);
  }
}
