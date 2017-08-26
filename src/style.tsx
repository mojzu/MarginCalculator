import { StyleSheet } from "react-native";

const common = {
  padding: 10,
  inputHeight: 45,
  borderRadius: 4,
};

export const colours = {
  // App component.
  statusBar: "#1A237E",
  headerTintColour: "#E8EAF6",
  headerBackgroundColour: "#3F51B5",
  containerBackgroundColour: "#E8EAF6",
  // MarginInput, CurrencyInput components.
  leftBackgroundColour: "#9FA8DA",
  rightBackgroundColour: "#C5CAE9",
  pressBackgroundColor: "#5C6BC0",
  // MarginForm component.
  marginFormResetButton: "#5C6BC0",
  marginFormCurrencyDateText: "#424242",
};

export const styles = StyleSheet.create({
  // App component.
  container: {
    flex: 1,
    backgroundColor: colours.containerBackgroundColour,
  },
  // MarginInput component.
  marginInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: common.padding,
  },
  marginInputTextTouchableHighlight: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.30,
    height: common.inputHeight,
    borderTopLeftRadius: common.borderRadius,
    borderBottomLeftRadius: common.borderRadius,
    backgroundColor: colours.leftBackgroundColour,
  },
  marginInputText: {
    fontWeight: "bold",
  },
  marginInputTextInput: {
    flex: 0.45,
    height: common.inputHeight,
    borderTopRightRadius: common.borderRadius,
    borderBottomRightRadius: common.borderRadius,
    backgroundColor: colours.rightBackgroundColour,
  },
  // CurrencyInput component.
  currencyInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: common.padding,
  },
  currencyInputPickerContainer: {
    flex: 0.55,
    height: common.inputHeight,
    borderTopLeftRadius: common.borderRadius,
    borderBottomLeftRadius: common.borderRadius,
    backgroundColor: colours.leftBackgroundColour,
  },
  currencyInputPicker: {
    height: common.inputHeight,
  },
  currencyInputTextInput: {
    flex: 0.20,
    height: common.inputHeight,
    borderTopRightRadius: common.borderRadius,
    borderBottomRightRadius: common.borderRadius,
    backgroundColor: colours.rightBackgroundColour,
  },
  // MarginForm component.
  marginFormResetButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: common.padding,
  },
  marginFormResetButtonContainerInner: {
    flex: 0.75,
  },
  marginFormCurrencyDateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: common.padding,
    paddingBottom: common.padding,
  },
  marginFormCurrencyDateContainerInnter: {
    flex: 0.75,
  },
  marginFormCurrencyDateText: {
    color: colours.marginFormCurrencyDateText,
    fontSize: 12,
  },
});
