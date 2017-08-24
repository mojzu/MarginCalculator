import * as React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "../style";

export interface IProps {
  text: string;
  value: string;
  onChangeText: (value: any) => void;
  onEndEditing: (value: any) => void;
}

export class MarginInput extends React.Component<IProps> {

  public render() {
    return (
      <View style={styles.marginInputContainer}>
        <View style={styles.marginInputTextContainer}>
          <Text style={styles.marginInputText}>
            {this.props.text}
          </Text>
        </View>
        <TextInput
          style={styles.marginInputTextInput}
          keyboardType="numeric"
          onChangeText={this.props.onChangeText}
          onEndEditing={this.props.onEndEditing}
          value={this.props.value}
        />
      </View>
    );
  }

}
