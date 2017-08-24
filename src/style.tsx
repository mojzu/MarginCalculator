import { StyleSheet } from "react-native";

export const colours = {
  statusBar: "#1A237E",
  headerTintColour: "#E8EAF6",
  headerBackgroundColour: "#3F51B5",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginInputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8eaf6",
  },
  marginInputTextContainer: {
    flex: 0.25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  marginInputText: {
    fontWeight: "bold",
  },
  marginInputTextInput: {
    flex: 0.45,
    height: 50,
  },
  currencyInputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c5cae9",
  },
  currencyInputPicker: {
    flex: 0.45,
    height: 50,
  },
  currencyInputTextInput: {
    flex: 0.25,
    height: 50,
  },
});
