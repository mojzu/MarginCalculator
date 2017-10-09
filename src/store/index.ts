import { applyMiddleware, combineReducers, compose, createStore, Store } from "redux";
import { createLogger } from "redux-logger";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { navigationReducer } from "../navigation";
import { epic as currencyRatesEpic, ICurrencyRates, reducer as currencyRatesReducer } from "./currencyRates";
import { IMarginCalculator, reducer as marginCalculatorReducer } from "./marginCalculator";

export interface IStoreState {
  currencyRates: ICurrencyRates;
  marginCalculator: IMarginCalculator;
  navigation: any;
}

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

export function configureStore(initialState?: IStoreState): Store<IStoreState> {

  // Combined application reducers.
  const reducer = combineReducers<IStoreState>({
    currencyRates: currencyRatesReducer,
    marginCalculator: marginCalculatorReducer,
    navigation: navigationReducer,
  });

  // Combined application epics.
  const epic = combineEpics(
    currencyRatesEpic,
  );
  const epicMiddleware = createEpicMiddleware(epic);

  // Middleware enhancer.
  const enhancer = compose<any, any, any>(
    applyMiddleware(epicMiddleware),
    applyMiddleware(loggerMiddleware),
  );

  if (initialState != null) {
    return createStore<IStoreState>(reducer, initialState, enhancer);
  }

  return createStore<IStoreState>(reducer, enhancer);
}
