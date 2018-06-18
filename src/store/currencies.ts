import { Action } from "@ngrx/store";

export interface IState {
  time: string;
  currenciesRates: { [key: string]: number };
}

export const initialState: IState = {
  time: "2018-06-18",
  currenciesRates: { EUR: 1.0 }
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
  public constructor(public readonly payload: { currencies: IState }) {}
}

export class GetError implements Action {
  public readonly type = EActions.GetError;
  public constructor(public readonly payload: { error: any }) {}
}

export type IActionsUnion = GetRequest | GetResponse | GetError;

export function reducer(state: IState = initialState, action: IActionsUnion): IState {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
