import * as React from "react";
import { View, Text, TextInput, Picker, Button, StyleSheet } from "react-native";
import { ICurrencyRates } from "../store/currencyRates";
import { IMarginCalculator, IUpdate, IUpdateCurrency } from "../store/marginCalculator";

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
    // TODO: Style improvements.
    // headerStyle: {
    //   backgroundColor: "skyblue",
    // },
  };

  public constructor(props: IProps) {
    super(props);
    this.props.ratesRequest();
  }

  public render() {

    const onReset = this.props.reset.bind(this);
    const onRecalculate = this.props.recalculate.bind(this);

    const onCostPriceChanged = this.onCostPriceChanged.bind(this);
    const costPrice = this.props.marginCalculator.displayCostPrice;

    const onCostPriceCurrencyChanged = this.onCostPriceCurrencyChanged.bind(this);
    const costPriceCurrency = this.props.marginCalculator.displayCostPriceCurrency;

    const onCostPriceCurrencyValueChanged = this.onCostPriceCurrencyValueChanged.bind(this);
    const costPriceCurrencyValue = this.props.marginCalculator.displayCostPriceCurrencyValue;

    const onSalePriceChanged = this.onSalePriceChanged.bind(this);
    const salePrice = this.props.marginCalculator.displaySalePrice;

    const onSalePriceCurrencyChanged = this.onSalePriceCurrencyChanged.bind(this);
    const salePriceCurrency = this.props.marginCalculator.displaySalePriceCurrency;

    const onSalePriceCurrencyValueChanged = this.onSalePriceCurrencyValueChanged.bind(this);
    const salePriceCurrencyValue = this.props.marginCalculator.displaySalePriceCurrencyValue;

    const onMarginChanged = this.onMarginChanged.bind(this);
    const margin = this.props.marginCalculator.displayMargin;

    const onMarkupChanged = this.onMarkupChanged.bind(this);
    const markup = this.props.marginCalculator.displayMarkup;

    const currencyLabels = [this.props.currencyRates.base].concat(Object.keys(this.props.currencyRates.rates));
    const currencyItems = [];
    for (const rate of currencyLabels) {
      currencyItems.push(<Picker.Item label={rate} value={rate} key={rate} />);
    }

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
          <Picker
            style={styles.inputPicker}
            selectedValue={costPriceCurrency}
            onValueChange={onCostPriceCurrencyChanged}
          >
            {currencyItems}
          </Picker>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={onCostPriceCurrencyValueChanged}
            onEndEditing={onRecalculate}
            value={costPriceCurrencyValue}
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
          <Picker
            style={styles.inputPicker}
            selectedValue={salePriceCurrency}
            onValueChange={onSalePriceCurrencyChanged}
          >
            {currencyItems}
          </Picker>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={onSalePriceCurrencyValueChanged}
            onEndEditing={onRecalculate}
            value={salePriceCurrencyValue}
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
  inputPicker: {
    width: 160,
  },
});
