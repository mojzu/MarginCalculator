import { createAction, handleActions } from "redux-actions";
import { ActionsObservable, combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";

export interface ICurrencyRates {
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

const defaultState: ICurrencyRates = {
  base: "GBP",
  date: "2017-08-23",
  rates: {
    GBP: 1.00,
  },
};

const RATES_REQUEST = "CurrencyRates/RatesRequest";
type RATES_REQUEST = typeof RATES_REQUEST;

const RATES_RESPONSE = "CurrencyRates/RatesResponse";
type RATES_RESPONSE = typeof RATES_RESPONSE;

export const ratesRequest = createAction<void>(RATES_REQUEST);
export const ratesResponse = createAction<ICurrencyRates>(RATES_RESPONSE);

export const reducer = handleActions<ICurrencyRates>({
  [RATES_REQUEST]: (state, action) => {
    return state;
  },
  [RATES_RESPONSE]: (state, action) => {
    if (!!action.payload) {
      const newState = { ...action.payload };
      newState.rates = Object.assign({ GBP: 1.00 }, newState.rates);
      return newState;
    }
    return state;
  },
}, defaultState);

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
      return Observable.fromPromise(fetchPromise);
    })
    .mergeMap((response) => {
      if (response.ok && (response.status === 200)) {
        return Observable.fromPromise<ICurrencyRates>(response.json());
      }
      return Observable.of(defaultState);
    })
    .map((data) => {
      return ratesResponse(data);
    });
};

export const epic = combineEpics(
  ratesRequestEpic,
);
