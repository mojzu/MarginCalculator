import * as React from "react";
import { View, TouchableHighlight, Text, TextInput } from "react-native";
import { styles, colours } from "../style";

export interface IProps {
  text: string;
  value: string;
  onTouch: () => void;
  onChangeText: (value: any) => void;
  onEndEditing: (value: any) => void;
}

export class MarginInput extends React.Component<IProps> {

  public render() {
    return (
      <View style={styles.marginInputContainer}>
        <TouchableHighlight
          style={styles.marginInputTextTouchableHighlight}
          underlayColor={colours.pressBackgroundColor}
          onPress={this.props.onTouch}
        >
          <Text style={styles.marginInputText}>
            {this.props.text}
          </Text>
        </TouchableHighlight>
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
