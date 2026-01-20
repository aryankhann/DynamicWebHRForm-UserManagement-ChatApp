import { TextInput, ViewStyle, TextStyle, StyleSheet } from "react-native";

interface FormTextFieldProps {
  pholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  securePassword?: boolean;
  style?: ViewStyle | TextStyle;
  editable?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
}

const FormTextField = ({
  pholder,
  value,
  onChangeText,
  securePassword = false,
  style,
  editable = true,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  numberOfLines = 1,
}: FormTextFieldProps) => {
  return (
    <TextInput
      placeholder={pholder}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={securePassword}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={[
        styles.input,
        multiline && styles.multilineInput,
        !editable && styles.disabled,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  disabled: {
    backgroundColor: "#F3F4F6",
    opacity: 0.6,
    borderColor: "#E5E7EB",
  },
});

export default FormTextField;