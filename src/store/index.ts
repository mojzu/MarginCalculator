import { ActionReducerMap } from "@ngrx/store";
import * as currencies from "./currencies";

export interface IState {
  currencies: currencies.IState;
}

export const initialState: IState = {
  currencies: currencies.initialState
};

export const reducers: ActionReducerMap<IState> = {
  currencies: currencies.reducer
};
