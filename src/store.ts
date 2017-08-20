import { combineReducers, compose, applyMiddleware, createStore } from "redux";
import { createAction, handleActions } from "redux-actions";
import { createLogger } from "redux-logger";
import { navigationReducer } from "./navigation";

// Start margin state.

export interface IMargin {

}

const marginDefaultState: IMargin = {};

export const UPDATE_MARGIN = "Margin/UPDATE";
export type UPDATE_MARGIN = typeof UPDATE_MARGIN;

export interface IUpdateMargin {
  value: number;
}

export const updateMargin = createAction<IUpdateMargin>(UPDATE_MARGIN);

export const marginReducer = handleActions<IMargin, IUpdateMargin>({
  [UPDATE_MARGIN]: {
    next: (state, action) => {
      return state;
    },
    throw: (state, action) => {
      return state;
    },
  },
}, marginDefaultState);

// End margin state.

export interface IStoreState {
  navigation: any;
  margin: IMargin;
}

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

export function configureStore(initialState?: IStoreState) {
  const reducer = combineReducers({
    navigation: navigationReducer,
    margin: marginReducer,
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
