import * as React from "react";
import { Picker, TextInput, View } from "react-native";
import { ICurrencyRates } from "../store/currencyRates";
import { styles } from "../style";

interface ICode {
  key: string;
  label: string;
}

const codeTable: ICode[] = [
  { key: "GBP", label: "GBP - Pound Sterling" },
  { key: "USD", label: "USD - US Dollar" },
  { key: "EUR", label: "EUR - Euro" },
  { key: "AUD", label: "AUD - Australian Dollar" },
  { key: "BGN", label: "BGN - Bulgarian Lev" },
  { key: "BRL", label: "BRL - Brazilian Real" },
  { key: "CAD", label: "CAD - Canadian Dollar" },
  { key: "CHF", label: "CHF - Swiss Franc" },
  { key: "CNY", label: "CNY - Yuan Renminbi" },
  { key: "CZK", label: "CZK - Czech Koruna" },
  { key: "DKK", label: "DKK - Danish Krone" },
  { key: "HKD", label: "HKD - Hong Kong Dollar" },
  { key: "HRK", label: "HRK - Kuna" },
  { key: "HUF", label: "HUF - Forint" },
  { key: "IDR", label: "IDR - Rupiah" },
  { key: "ILS", label: "ILS - New Israeli Sheqel" },
  { key: "INR", label: "INR - Indian Rupee" },
  { key: "JPY", label: "JPY - Yen" },
  { key: "KRW", label: "KRW - Won" },
  { key: "MXN", label: "MXN - Mexican Peso" },
  { key: "MYR", label: "MYR - Malaysian Ringgit" },
  { key: "NOK", label: "NOK - Norwegian Krone" },
  { key: "NZD", label: "NZD - New Zealand Dollar" },
  { key: "PHP", label: "PHP - Philippine Peso" },
  { key: "PLN", label: "PLN - Zloty" },
  { key: "RON", label: "RON - Romanian Leu" },
  { key: "RUB", label: "RUB - Russian Ruble" },
  { key: "SEK", label: "SEK - Swedish Krona" },
  { key: "SGD", label: "SGD - Singapore Dollar" },
  { key: "THB", label: "THB - Baht" },
  { key: "TRY", label: "TRY - Turkish Lira" },
  { key: "ZAR", label: "ZAR - Rand" },
];

export interface IProps {
  currencyRates: ICurrencyRates;
  selectedValue: string;
  value: string;
  onValueChange: (value: any) => void;
  onChangeText: (value: any) => void;
  onEndEditing: (value: any) => void;
}

export class CurrencyInput extends React.Component<IProps> {

  public render() {
    const rates = this.props.currencyRates.rates;
    const items: any[] = [];

    codeTable.map((code) => {
      if (rates.hasOwnProperty(code.key)) {
        items.push(<Picker.Item label={code.label} value={code.key} key={code.key} />);
      }
    });

    return (
      <View style={styles.currencyInputContainer}>
        <View style={styles.currencyInputPickerContainer}>
          <Picker
            style={styles.currencyInputPicker}
            selectedValue={this.props.selectedValue}
            onValueChange={this.props.onValueChange}
          >
            {items}
          </Picker>
        </View>
        <TextInput
          style={styles.currencyInputTextInput}
          keyboardType="numeric"
          onChangeText={this.props.onChangeText}
          onEndEditing={this.props.onEndEditing}
          value={this.props.value}
        />
      </View>
    );
  }

}
