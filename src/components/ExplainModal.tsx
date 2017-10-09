import * as React from "react";
import { Modal, Text, TouchableHighlight, View } from "react-native";
import { colours, styles } from "../style";

export interface IExplainModalState {
  visible: boolean;
  title?: string;
  text?: string;
}

export interface IProps {
  state: IExplainModalState;
  onRequestClose: () => void;
  onTouch: () => void;
}

export class ExplainModal extends React.Component<IProps> {

  public render() {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.props.state.visible}
        onRequestClose={this.props.onRequestClose}
      >
        <TouchableHighlight
          style={styles.explainModalTouchableContainer}
          underlayColor={colours.pressAlphaBackgroundColor}
          onPress={this.props.onTouch}
        >
          <View style={styles.explainModalContainer}>
            <Text style={styles.explainModelTitle}>
              {this.props.state.title}
            </Text>
            <Text style={styles.explainModelText}>
              {this.props.state.text}
            </Text>
          </View>
        </TouchableHighlight>
      </Modal>
    );
  }

}
