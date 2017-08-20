import * as React from "react";
import { Provider } from "react-redux";
import { AppRegistry } from "react-native";
import { addNavigationHelpers } from "react-navigation";
import { connect } from "react-redux";
import { configureStore } from "./store";
import { AppNavigator } from "./navigation";

const store = configureStore();

class App extends React.Component<{
  navigation: any;
  dispatch: any;
}> {
  public render() {
    const helpers = {
      dispatch: this.props.dispatch,
      state: this.props.navigation,
    };
    return (
      <AppNavigator navigation={addNavigationHelpers(helpers)} />
    );
  }
}

const mapStateToProps = (state: any) => ({ navigation: state.navigation });

const AppWithNavigationState = connect(mapStateToProps)(App);

export default class Root extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent("MarginCalculator", () => Root);
