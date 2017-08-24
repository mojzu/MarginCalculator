import { StackNavigator } from "react-navigation";
import MarginForm from "./containers/MarginForm";

export const ROUTES = {
  MARGIN_FORM: "MarginForm",
};

export const AppNavigator = StackNavigator({
  [ROUTES.MARGIN_FORM]: { screen: MarginForm },
});

const initialState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams(ROUTES.MARGIN_FORM), null);

export const navigationReducer = (state = initialState, action: any) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
};
