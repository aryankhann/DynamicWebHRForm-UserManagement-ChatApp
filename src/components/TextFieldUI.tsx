import { TextInput, ViewStyle, TextStyle } from 'react-native';

interface TypedInput {
  pholder: string;
  securePassword?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle | TextStyle;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const TextFieldUI = ({
  pholder,
  securePassword,
  value,
  onChangeText,
  style,
  editable = true,
  keyboardType = 'default',
  autoCapitalize = 'none'
}: TypedInput) => {
  return (
    <TextInput
      placeholder={pholder}
      secureTextEntry={securePassword}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      style={[
        {
          borderWidth: 1,
          width: '80%',
          height: 52,
          paddingLeft: 20,
          borderRadius: 10,
          borderColor: 'gray',
          fontSize: 16
        },
        style
      ]}
    />
  );
};

export default TextFieldUI;