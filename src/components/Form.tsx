import * as React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { IMarginCalculator, IUpdate } from "../store";

export interface IPropsState {
  marginCalculator: IMarginCalculator;
}

export interface IPropsDispatch {
  reset: () => void;
  recalculate: () => void;
  updateCostPrice: (payload: IUpdate) => void;
  updateSalePrice: (payload: IUpdate) => void;
  updateMargin: (payload: IUpdate) => void;
  updateMarkup: (payload: IUpdate) => void;
}

export interface IProps extends IPropsState, IPropsDispatch { }

export class Form extends React.Component<IProps> {

  public static navigationOptions = {
    title: "Margin Calculator",
  };

  public render() {

    const onReset = this.props.reset.bind(this);
    const onRecalculate = this.props.recalculate.bind(this);

    const onCostPriceChanged = this.onCostPriceChanged.bind(this);
    const costPrice = this.props.marginCalculator.displayCostPrice;

    const onSalePriceChanged = this.onSalePriceChanged.bind(this);
    const salePrice = this.props.marginCalculator.displaySalePrice;

    const onMarginChanged = this.onMarginChanged.bind(this);
    const margin = this.props.marginCalculator.displayMargin;

    const onMarkupChanged = this.onMarkupChanged.bind(this);
    const markup = this.props.marginCalculator.displayMarkup;

    return (
      <View style={styles.container}>

        <Text>Cost Price</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={onCostPriceChanged}
          onEndEditing={onRecalculate}
          value={costPrice}
        />

        <Text>Sale Price</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={onSalePriceChanged}
          onEndEditing={onRecalculate}
          value={salePrice}
        />

        <Text>Margin</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={onMarginChanged}
          onEndEditing={onRecalculate}
          value={margin}
        />

        <Text>Markup</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={onMarkupChanged}
          onEndEditing={onRecalculate}
          value={markup}
        />

        <Button
          onPress={onReset}
          title="Reset"
        />

      </View>
    );
  }

  protected onCostPriceChanged(value: string): void {
    this.props.updateCostPrice({ value });
  }

  protected onSalePriceChanged(value: string): void {
    this.props.updateSalePrice({ value });
  }

  protected onMarginChanged(value: string): void {
    this.props.updateMargin({ value });
  }

  protected onMarkupChanged(value: string): void {
    this.props.updateMarkup({ value });
  }

}

export default Form;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    height: 40,
  },
});

// export default class MarginCalculator extends React.Component {
//   public render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.android.js
//         </Text>
//         <Text style={styles.instructions}>
//           Double tap R on your keyboard to reload,{"\n"}
//           Shake or press menu button for dev menu
//         </Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F5FCFF",
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: "center",
//     margin: 10,
//   },
//   instructions: {
//     textAlign: "center",
//     color: "#333333",
//     marginBottom: 5,
//   },
// });
