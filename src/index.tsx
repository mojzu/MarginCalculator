import * as React from "react";
import { Dispatch } from "redux";
import { Provider } from "react-redux";
import { AppRegistry, View, StatusBar } from "react-native";
import { addNavigationHelpers } from "react-navigation";
import { connect } from "react-redux";
import { ratesRequest } from "./store/currencyRates";
import { IStoreState, configureStore } from "./store";
import { AppNavigator } from "./navigation";
import { colours, styles } from "./style";

interface IPropsState {
  navigation: any;
  dispatch?: any;
}

interface IPropsDispatch {
  ratesRequest: () => void;
}

interface IProps extends IPropsState, IPropsDispatch { }

// Create and configure Redux store.
const store = configureStore();

class App extends React.Component<IProps> {

  public constructor(props: IProps) {
    super(props);

    // Request updated currency rates.
    this.props.ratesRequest();
  }

  public render() {
    const helpers = {
      dispatch: this.props.dispatch,
      state: this.props.navigation,
    };
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colours.statusBar} />
        <AppNavigator navigation={addNavigationHelpers(helpers)} />
      </View>
    );
  }

}

function mapStateToProps({ navigation }: IStoreState): IPropsState {
  return { navigation };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IPropsDispatch {
  return { ratesRequest: () => dispatch(ratesRequest(undefined)) };
}

const AppWithNavigationState = connect(mapStateToProps, mapDispatchToProps)(App);

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
