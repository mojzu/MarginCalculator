import { StackNavigator } from "react-navigation";
import Form from "./containers/Form";

export const ROUTES = {
  FORM: "Form",
};

export const AppNavigator = StackNavigator({
  [ROUTES.FORM]: { screen: Form },
});

const initialState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams(ROUTES.FORM), null);

export const navigationReducer = (state = initialState, action: any) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
};
