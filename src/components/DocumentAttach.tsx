import { View, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import DocumentPicker from 'react-native-document-picker';
import TextUI from "./TextUI";

interface DocumentAttachProps {
  onDocumentSelect?: (document: any) => void;
}

const DocumentAttach = ({ onDocumentSelect }: DocumentAttachProps) => {
  
  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });

      console.log('Selected document:', result[0]);
      
      if (onDocumentSelect) {
        onDocumentSelect(result[0]);
      }
      
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleDocumentPick}
      style={{ 
        flexDirection: "row", 
        gap: 10, 
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignContent: 'center',
        justifyContent: 'space-evenly',
        width: '50%',
        padding: 10,
        borderRadius: 10 
      }}
    >
      <FontAwesomeIcon icon={faPaperclip as IconProp} size={16} />
      <TextUI text="Add Attachment" />
    </TouchableOpacity>
  );
};

export default DocumentAttach;