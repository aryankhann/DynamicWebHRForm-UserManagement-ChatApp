import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import TextUI from "./TextUI";

interface TypedBtn {
  text: string;
  onNext?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const ButtonBlue = ({ text, onNext, disabled = false, style }: TypedBtn) => {
  return (
    <TouchableOpacity
      onPress={onNext}
      disabled={disabled}
      style={[
        styles.makeItBlue,
        { width: '100%', height: 40, alignItems: 'center', justifyContent: 'center' },
        disabled && styles.disabled,
        style
      ]}
    >
      <TextUI text={text} style={{ color: 'white', textAlign: 'center' }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  makeItBlue: {
    borderRadius: 10,
    backgroundColor: '#0C64AE',
  },
  disabled: {
    backgroundColor: '#6B9BC7',
    opacity: 0.6,
  }
});

export default ButtonBlue;