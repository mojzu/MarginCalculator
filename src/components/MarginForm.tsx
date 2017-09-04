import * as React from "react";
import { ScrollView, View, Button, Text } from "react-native";
import { ICurrencyRates } from "../store/currencyRates";
import { IMarginCalculator, IUpdate } from "../store/marginCalculator";
import { colours, styles } from "../style";
import { IExplainModalState, ExplainModal } from "./ExplainModal";
import { MarginInput } from "./MarginInput";
import { CurrencyInput } from "./CurrencyInput";
import { MarginOutput } from "./MarginOutput";

const titles = {
  costPrice: "Cost Price",
  salePrice: "Sale Price",
  margin: "Margin (%)",
  markup: "Markup (%)",
  discount: "Discount (%)",
  discountedSalePrice: "Discounted Sale Price",
  discountedMargin: "Discounted Margin (%)",
  discountedMarkup: "Discounted Markup (%)",
};

export interface IPropsState {
  currencyRates: ICurrencyRates;
  marginCalculator: IMarginCalculator;
}

export interface IPropsDispatch {
  reset: () => void;
  recalculate: () => void;
  updateCostPrice: (payload: IUpdate) => void;
  updateCostPriceCurrency: (payload: IUpdate) => void;
  updateCostPriceCurrencyValue: (payload: IUpdate) => void;
  updateSalePrice: (payload: IUpdate) => void;
  updateSalePriceCurrency: (payload: IUpdate) => void;
  updateSalePriceCurrencyValue: (payload: IUpdate) => void;
  updateMargin: (payload: IUpdate) => void;
  updateMarkup: (payload: IUpdate) => void;
  updateDiscount: (payload: IUpdate) => void;
}

export interface IProps extends IPropsState, IPropsDispatch { }

export class MarginForm extends React.Component<IProps, IExplainModalState> {

  public static navigationOptions = {
    title: "Margin Calculator",
    headerTintColor: colours.headerTintColour,
    headerStyle: {
      backgroundColor: colours.headerBackgroundColour,
    },
  };

  public state: IExplainModalState = {
    visible: false,
  };

  public render() {

    const costPrice = this.props.marginCalculator.display.costPrice;
    const costPriceCurrency = this.props.marginCalculator.display.costPriceCurrency;
    const costPriceCurrencyValue = this.props.marginCalculator.display.costPriceCurrencyValue;

    const salePrice = this.props.marginCalculator.display.salePrice;
    const salePriceCurrency = this.props.marginCalculator.display.salePriceCurrency;
    const salePriceCurrencyValue = this.props.marginCalculator.display.salePriceCurrencyValue;

    const margin = this.props.marginCalculator.display.margin;
    const markup = this.props.marginCalculator.display.markup;
    const discount = this.props.marginCalculator.display.discount;
    const discountedSalePrice = this.props.marginCalculator.display.discountedSalePrice;
    const discountedMargin = this.props.marginCalculator.display.discountedMargin;
    const discountedMarkup = this.props.marginCalculator.display.discountedMarkup;

    const onReset = this.props.reset.bind(this);
    const onRecalculate = this.props.recalculate.bind(this);

    return (
      <ScrollView>

        <ExplainModal
          state={this.state}
          onRequestClose={this.onModalRequestClose()}
          onTouch={this.onModalRequestClose()}
        />

        <MarginInput
          text={titles.costPrice}
          value={costPrice}
          onTouch={this.onTouchInput("costPrice")}
          onChangeText={this.onCostPriceChanged()}
          onEndEditing={onRecalculate}
        />

        <CurrencyInput
          currencyRates={this.props.currencyRates}
          selectedValue={costPriceCurrency}
          value={costPriceCurrencyValue}
          onValueChange={this.onCostPriceCurrencyChanged()}
          onChangeText={this.onCostPriceCurrencyValueChanged()}
          onEndEditing={onRecalculate}
        />

        <MarginInput
          text={titles.salePrice}
          value={salePrice}
          onTouch={this.onTouchInput("salePrice")}
          onChangeText={this.onSalePriceChanged()}
          onEndEditing={onRecalculate}
        />

        <CurrencyInput
          currencyRates={this.props.currencyRates}
          selectedValue={salePriceCurrency}
          value={salePriceCurrencyValue}
          onValueChange={this.onSalePriceCurrencyChanged()}
          onChangeText={this.onSalePriceCurrencyValueChanged()}
          onEndEditing={onRecalculate}
        />

        <MarginInput
          text={titles.margin}
          value={margin}
          onTouch={this.onTouchInput("margin")}
          onChangeText={this.onMarginChanged()}
          onEndEditing={onRecalculate}
        />

        <MarginInput
          text={titles.markup}
          value={markup}
          onTouch={this.onTouchInput("markup")}
          onChangeText={this.onMarkupChanged()}
          onEndEditing={onRecalculate}
        />

        <MarginInput
          text={titles.discount}
          value={discount}
          onTouch={this.onTouchInput("discount")}
          onChangeText={this.onDiscountChanged()}
          onEndEditing={onRecalculate}
        />

        <MarginOutput
          text={titles.discountedSalePrice}
          value={discountedSalePrice}
          onTouch={this.onTouchInput("discountedSalePrice")}
        />

        <MarginOutput
          text={titles.discountedMargin}
          value={discountedMargin}
          onTouch={this.onTouchInput("discountedMargin")}
        />

        <MarginOutput
          text={titles.discountedMarkup}
          value={discountedMarkup}
          onTouch={this.onTouchInput("discountedMarkup")}
        />

        <View style={styles.marginFormResetButtonContainer}>
          <View style={styles.marginFormResetButtonContainerInner}>
            <Button
              onPress={onReset}
              title={"Reset"}
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

  protected setModalVisible(visible: boolean, title?: string, text?: string) {
    this.setState({ visible, title, text });
  }

  protected onModalRequestClose() {
    return () => {
      this.setModalVisible(false);
    };
  }

  protected onTouchInput(value: string) {
    return () => {
      if (this.props.marginCalculator.explain.hasOwnProperty(value)) {
        const title = titles[value];
        const text = this.props.marginCalculator.explain[value];
        this.setModalVisible(true, title, text);
      }
    };
  }

  protected onCostPriceChanged() {
    return (value: string) => {
      this.props.updateCostPrice({ value });
    };
  }

  protected onCostPriceCurrencyChanged() {
    return (label: string) => {
      const value = ((label === this.props.currencyRates.base) ? 1 : this.props.currencyRates.rates[label]).toFixed(4);
      this.props.updateCostPriceCurrency({ label, value });
    };
  }

  protected onCostPriceCurrencyValueChanged() {
    return (value: string) => {
      this.props.updateCostPriceCurrencyValue({ value });
    };
  }

  protected onSalePriceChanged() {
    return (value: string) => {
      this.props.updateSalePrice({ value });
    };
  }

  protected onSalePriceCurrencyChanged() {
    return (label: string) => {
      const value = ((label === this.props.currencyRates.base) ? 1 : this.props.currencyRates.rates[label]).toFixed(4);
      this.props.updateSalePriceCurrency({ label, value });
    };
  }

  protected onSalePriceCurrencyValueChanged() {
    return (value: string) => {
      this.props.updateSalePriceCurrencyValue({ value });
    };
  }

  protected onMarginChanged() {
    return (value: string) => {
      this.props.updateMargin({ value });
    };
  }

  protected onMarkupChanged() {
    return (value: string) => {
      this.props.updateMarkup({ value });
    };
  }

  protected onDiscountChanged() {
    return (value: string) => {
      this.props.updateDiscount({ value });
    };
  }

}

export default MarginForm;
