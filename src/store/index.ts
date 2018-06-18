import { ActionReducerMap } from "@ngrx/store";
import * as calculator from "./calculator";
import * as currencies from "./currencies";

export { calculator, currencies };

export interface IState {
  calculator: calculator.IState;
  currencies: currencies.IState;
}

export const initialState: IState = {
  calculator: calculator.initialState,
  currencies: currencies.initialState
};

export const reducers: ActionReducerMap<IState> = {
  calculator: calculator.reducer,
  currencies: currencies.reducer
};
