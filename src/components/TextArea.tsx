import { TextInput, StyleSheet, View } from "react-native";

interface TextAreaProps {
  placeholder?: string;
  value?: string;
  multilinel?:boolean
  onChangeText?: (text: string) => void;
  editable?:boolean
}

const TextArea = ({
  placeholder = "Type here...",
  value,
  onChangeText,
  multilinel,editable
}: TextAreaProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textarea}
        multiline={multilinel}
        numberOfLines={5}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        textAlignVertical="top" 
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    height: 120, 
  },
});

export default TextArea;
