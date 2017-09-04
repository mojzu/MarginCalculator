import * as React from "react";
import { View, TouchableHighlight, Text } from "react-native";
import { styles, colours } from "../style";

export interface IProps {
  text: string;
  value: string;
  onTouch: () => void;
}

export class MarginOutput extends React.Component<IProps> {

  public render() {
    // TODO
    return (
      <View style={styles.marginOutputContainer}>
        <TouchableHighlight
          style={styles.marginOutputTextTouchableHighlight}
          underlayColor={colours.pressBackgroundColor}
          onPress={this.props.onTouch}
        >
          <Text style={styles.marginOutputText}>
            {this.props.text}
          </Text>
        </TouchableHighlight>
        <View style={styles.marginOutputValueContainer}>
          <Text style={styles.marginOutputValueText}>
            {this.props.value}
          </Text>
        </View>
      </View>
    );
  }

}
