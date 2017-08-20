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
    headerStyle: {
      backgroundColor: "skyblue",
    },
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

        <View style={styles.inputContainer}>
          <View style={styles.inputTextContainer}>
            <Text style={styles.textLabel}>
              Cost Price
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={onCostPriceChanged}
            onEndEditing={onRecalculate}
            value={costPrice}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputTextContainer}>
            <Text style={styles.textLabel}>
              Sale Price
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={onSalePriceChanged}
            onEndEditing={onRecalculate}
            value={salePrice}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputTextContainer}>
            <Text style={styles.textLabel}>
              Margin (%)
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={onMarginChanged}
            onEndEditing={onRecalculate}
            value={margin}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputTextContainer}>
            <Text style={styles.textLabel}>
              Markup (%)
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={onMarkupChanged}
            onEndEditing={onRecalculate}
            value={markup}
          />
        </View>

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
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  inputTextContainer: {
    flex: 0.25,
    height: 40,
    borderWidth: 1,
    borderColor: "#AFAFAF",
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  textLabel: {
    fontWeight: "bold",
  },
  textInput: {
    flex: 0.45,
    height: 40,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: "#AFAFAF",
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});
