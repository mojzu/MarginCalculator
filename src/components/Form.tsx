import * as React from "react";
import { View, Text, TextInput, Picker, Button, StyleSheet } from "react-native";
import { ICurrencyRates } from "../store/currencyRates";
import { IMarginCalculator, IUpdate, IUpdateCurrency } from "../store/marginCalculator";
import { colours } from "../style";

export interface IPropsState {
  currencyRates: ICurrencyRates;
  marginCalculator: IMarginCalculator;
}

export interface IPropsDispatch {
  ratesRequest: () => void;
  reset: () => void;
  recalculate: () => void;
  updateCostPrice: (payload: IUpdate) => void;
  updateCostPriceCurrency: (payload: IUpdateCurrency) => void;
  updateCostPriceCurrencyValue: (payload: IUpdate) => void;
  updateSalePrice: (payload: IUpdate) => void;
  updateSalePriceCurrency: (payload: IUpdateCurrency) => void;
  updateSalePriceCurrencyValue: (payload: IUpdate) => void;
  updateMargin: (payload: IUpdate) => void;
  updateMarkup: (payload: IUpdate) => void;
}

export interface IProps extends IPropsState, IPropsDispatch { }

export class Form extends React.Component<IProps> {

  public static navigationOptions = {
    title: "Margin Calculator",
    headerTintColor: colours.headerTintColour,
    headerStyle: {
      backgroundColor: colours.headerBackgroundColour,
    },
  };

  protected handlers: any;

  public constructor(props: IProps) {
    super(props);

    // Request updated currency rates.
    this.props.ratesRequest();

    // Bind action handlers for templates.
    this.handlers = {
      onReset: this.props.reset.bind(this),
      onRecalculate: this.props.recalculate.bind(this),
      onCostPriceChanged: this.onCostPriceChanged.bind(this),
      onCostPriceCurrencyChanged: this.onCostPriceCurrencyChanged.bind(this),
      onCostPriceCurrencyValueChanged: this.onCostPriceCurrencyValueChanged.bind(this),
      onSalePriceChanged: this.onSalePriceChanged.bind(this),
      onSalePriceCurrencyChanged: this.onSalePriceCurrencyChanged.bind(this),
      onSalePriceCurrencyValueChanged: this.onSalePriceCurrencyValueChanged.bind(this),
      onMarginChanged: this.onMarginChanged.bind(this),
      onMarkupChanged: this.onMarkupChanged.bind(this),
    };
  }

  public render() {

    const costPrice = this.props.marginCalculator.displayCostPrice;
    const costPriceCurrency = this.props.marginCalculator.displayCostPriceCurrency;
    const costPriceCurrencyValue = this.props.marginCalculator.displayCostPriceCurrencyValue;

    const salePrice = this.props.marginCalculator.displaySalePrice;
    const salePriceCurrency = this.props.marginCalculator.displaySalePriceCurrency;
    const salePriceCurrencyValue = this.props.marginCalculator.displaySalePriceCurrencyValue;

    const margin = this.props.marginCalculator.displayMargin;
    const markup = this.props.marginCalculator.displayMarkup;

    const currencyLabels = [this.props.currencyRates.base].concat(Object.keys(this.props.currencyRates.rates));
    const currencyItems = [];
    for (const rate of currencyLabels) {
      currencyItems.push(<Picker.Item label={rate} value={rate} key={rate} />);
    }

    return (
      <View style={styles.container}>

        <View style={styles.rowContainerEven}>
          <View style={styles.inputTextContainer}>
            <Text style={styles.inputText}>
              Cost Price
            </Text>
          </View>
          <TextInput
            style={styles.inputTextInput}
            keyboardType="numeric"
            onChangeText={this.handlers.onCostPriceChanged}
            onEndEditing={this.handlers.onRecalculate}
            value={costPrice}
          />
        </View>

        <View style={styles.rowContainerOdd}>
          <Picker
            style={styles.picker}
            selectedValue={costPriceCurrency}
            onValueChange={this.handlers.onCostPriceCurrencyChanged}
          >
            {currencyItems}
          </Picker>
          <TextInput
            style={styles.pickerTextInput}
            keyboardType="numeric"
            onChangeText={this.handlers.onCostPriceCurrencyValueChanged}
            onEndEditing={this.handlers.onRecalculate}
            value={costPriceCurrencyValue}
          />
        </View>

        <View style={styles.rowContainerEven}>
          <View style={styles.inputTextContainer}>
            <Text style={styles.inputText}>
              Sale Price
            </Text>
          </View>
          <TextInput
            style={styles.inputTextInput}
            keyboardType="numeric"
            onChangeText={this.handlers.onSalePriceChanged}
            onEndEditing={this.handlers.onRecalculate}
            value={salePrice}
          />
        </View>

        <View style={styles.rowContainerOdd}>
          <Picker
            style={styles.picker}
            selectedValue={salePriceCurrency}
            onValueChange={this.handlers.onSalePriceCurrencyChanged}
          >
            {currencyItems}
          </Picker>
          <TextInput
            style={styles.pickerTextInput}
            keyboardType="numeric"
            onChangeText={this.handlers.onSalePriceCurrencyValueChanged}
            onEndEditing={this.handlers.onRecalculate}
            value={salePriceCurrencyValue}
          />
        </View>

        <View style={styles.rowContainerEven}>
          <View style={styles.inputTextContainer}>
            <Text style={styles.inputText}>
              Margin (%)
            </Text>
          </View>
          <TextInput
            style={styles.inputTextInput}
            keyboardType="numeric"
            onChangeText={this.handlers.onMarginChanged}
            onEndEditing={this.handlers.onRecalculate}
            value={margin}
          />
        </View>

        <View style={styles.rowContainerOdd}>
          <View style={styles.inputTextContainer}>
            <Text style={styles.inputText}>
              Markup (%)
            </Text>
          </View>
          <TextInput
            style={styles.inputTextInput}
            keyboardType="numeric"
            onChangeText={this.handlers.onMarkupChanged}
            onEndEditing={this.handlers.onRecalculate}
            value={markup}
          />
        </View>

        <Button
          onPress={this.handlers.onReset}
          title="Reset"
          color="#5c6bc0"
        />

      </View>
    );
  }

  protected onCostPriceChanged(value: string): void {
    this.props.updateCostPrice({ value });
  }

  protected onCostPriceCurrencyChanged(label: string): void {
    const value = ((label === this.props.currencyRates.base) ? 1 : this.props.currencyRates.rates[label]).toFixed(4);
    this.props.updateCostPriceCurrency({ label, value });
  }

  protected onCostPriceCurrencyValueChanged(value: string): void {
    this.props.updateCostPriceCurrencyValue({ value });
  }

  protected onSalePriceChanged(value: string): void {
    this.props.updateSalePrice({ value });
  }

  protected onSalePriceCurrencyChanged(label: string): void {
    const value = ((label === this.props.currencyRates.base) ? 1 : this.props.currencyRates.rates[label]).toFixed(4);
    this.props.updateSalePriceCurrency({ label, value });
  }

  protected onSalePriceCurrencyValueChanged(value: string): void {
    this.props.updateSalePriceCurrencyValue({ value });
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
  rowContainerEven: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8eaf6",
  },
  rowContainerOdd: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c5cae9",
  },
  // Value input styles.
  inputTextContainer: {
    flex: 0.25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    fontWeight: "bold",
  },
  inputTextInput: {
    flex: 0.45,
    height: 50,
  },
  // Picker input styles.
  picker: {
    flex: 0.45,
    height: 50,
  },
  pickerTextInput: {
    flex: 0.25,
    height: 50,
  },
});
