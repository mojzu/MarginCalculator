import { Action } from "@ngrx/store";

export interface IState {
  display: {
    costPrice: string;
    costPriceCurrency: string;
    costPriceCurrencyRate: string;
    salePrice: string;
    salePriceCurrency: string;
    salePriceCurrencyRate: string;
    margin: string;
    markup: string;
    discount: string;
    discountedSalePrice: string;
    discountedMargin: string;
    discountedMarkup: string;
  };
}

export const initialState: IState = {
  display: {
    costPrice: "",
    costPriceCurrency: "EUR",
    costPriceCurrencyRate: "1.0000",
    salePrice: "",
    salePriceCurrency: "EUR",
    salePriceCurrencyRate: "1.0000",
    margin: "",
    markup: "",
    discount: "",
    discountedSalePrice: "",
    discountedMargin: "",
    discountedMarkup: ""
  }
};

export enum EActions {
  Reset = "Calculator/Reset"
}

export class Reset implements Action {
  public readonly type = EActions.Reset;
}

export type IActionsUnion = Reset;

export function reducer(state: IState = initialState, action: IActionsUnion): IState {
  switch (action.type) {
    case EActions.Reset: {
      return { ...initialState };
    }
    default: {
      return { ...state };
    }
  }
}
