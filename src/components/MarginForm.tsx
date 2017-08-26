import * as React from "react";
import { ScrollView, View, Button, Text } from "react-native";
import { ICurrencyRates } from "../store/currencyRates";
import { IMarginCalculator, IUpdate, IUpdateCurrency } from "../store/marginCalculator";
import { colours, styles } from "../style";
import { MarginInput } from "./MarginInput";
import { CurrencyInput } from "./CurrencyInput";

export interface IPropsState {
  currencyRates: ICurrencyRates;
  marginCalculator: IMarginCalculator;
}

export interface IPropsDispatch {
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
  updateDiscount: (payload: IUpdate) => void;
}

export interface IProps extends IPropsState, IPropsDispatch { }

export class MarginForm extends React.Component<IProps> {

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
      onDiscountChanged: this.onDiscountChanged.bind(this),
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
    const discount = this.props.marginCalculator.displayDiscount;

    return (
      <ScrollView>

        <MarginInput
          text="Cost Price"
          value={costPrice}
          onChangeText={this.handlers.onCostPriceChanged}
          onEndEditing={this.handlers.onRecalculate}
        />

        <CurrencyInput
          currencyRates={this.props.currencyRates}
          selectedValue={costPriceCurrency}
          value={costPriceCurrencyValue}
          onValueChange={this.handlers.onCostPriceCurrencyChanged}
          onChangeText={this.handlers.onCostPriceCurrencyValueChanged}
          onEndEditing={this.handlers.onRecalculate}
        />

        <MarginInput
          text="Sale Price"
          value={salePrice}
          onChangeText={this.handlers.onSalePriceChanged}
          onEndEditing={this.handlers.onRecalculate}
        />

        <CurrencyInput
          currencyRates={this.props.currencyRates}
          selectedValue={salePriceCurrency}
          value={salePriceCurrencyValue}
          onValueChange={this.handlers.onSalePriceCurrencyChanged}
          onChangeText={this.handlers.onSalePriceCurrencyValueChanged}
          onEndEditing={this.handlers.onRecalculate}
        />

        <MarginInput
          text="Margin (%)"
          value={margin}
          onChangeText={this.handlers.onMarginChanged}
          onEndEditing={this.handlers.onRecalculate}
        />

        <MarginInput
          text="Markup (%)"
          value={markup}
          onChangeText={this.handlers.onMarkupChanged}
          onEndEditing={this.handlers.onRecalculate}
        />

        <MarginInput
          text="Discount (%)"
          value={discount}
          onChangeText={this.handlers.onDiscountChanged}
          onEndEditing={this.handlers.onRecalculate}
        />

        <View style={styles.marginFormResetButtonContainer}>
          <View style={styles.marginFormResetButtonContainerInner}>
            <Button
              onPress={this.handlers.onReset}
              title="Reset"
              color={colours.marginFormResetButton}
            />
          </View>
        </View>

        <View style={styles.marginFormCurrencyDateContainer}>
          <View style={styles.marginFormCurrencyDateContainerInnter}>
            <Text style={styles.marginFormCurrencyDateText}>
              Exchange rates from: {this.props.currencyRates.date}
            </Text>
          </View>
        </View>

      </ScrollView>
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

  protected onDiscountChanged(value: string): void {
    this.props.updateDiscount({ value });
  }

}

export default MarginForm;
