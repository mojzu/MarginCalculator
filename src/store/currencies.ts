import { Action } from "@ngrx/store";

export interface ICurrenciesRates {
  [key: string]: number;
}

export interface IState {
  time: string;
  currenciesRates: ICurrenciesRates;
  error: any;
}

export const initialState: IState = {
  time: "2018-06-18",
  currenciesRates: { EUR: 1.0 },
  error: undefined
};

export enum EActions {
  GetRequest = "Currencies/GetRequest",
  GetResponse = "Currencies/GetResponse",
  GetError = "Currencies/GetError"
}

export class GetRequest implements Action {
  public readonly type = EActions.GetRequest;
}

export class GetResponse implements Action {
  public readonly type = EActions.GetResponse;
  public constructor(public readonly payload: { time: string; currenciesRates: ICurrenciesRates }) {}
}

export class GetError implements Action {
  public readonly type = EActions.GetError;
  public constructor(public readonly payload: { error: any }) {}
}

export type IActionsUnion = GetRequest | GetResponse | GetError;

export function reducer(state: IState = initialState, action: IActionsUnion): IState {
  switch (action.type) {
    case EActions.GetResponse: {
      return {
        ...state,
        time: action.payload.time,
        currenciesRates: { ...state.currenciesRates, ...action.payload.currenciesRates }
      };
    }
    case EActions.GetError: {
      return { ...state, error: action.payload.error };
    }
    default: {
      return { ...state };
    }
  }
}
