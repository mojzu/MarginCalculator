import * as React from "react";
import { View, Picker, TextInput } from "react-native";
import { ICurrencyRates } from "../store/currencyRates";
import { styles } from "../style";

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
    const labels = [this.props.currencyRates.base].concat(Object.keys(this.props.currencyRates.rates));
    const items = [];
    for (const rate of labels) {
      items.push(<Picker.Item label={rate} value={rate} key={rate} />);
    }

    return (
      <View style={styles.currencyInputContainer}>
        <Picker
          style={styles.currencyInputPicker}
          selectedValue={this.props.selectedValue}
          onValueChange={this.props.onValueChange}
        >
          {items}
        </Picker>
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
