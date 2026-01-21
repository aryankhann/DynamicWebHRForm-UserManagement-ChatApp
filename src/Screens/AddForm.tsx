import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import ButtonBlue from "../components/ButtonBlue";
import { useState, useEffect } from "react";
import TextUI from "../components/TextUI";
import FormTextField from "../components/FormTextField";
import Listbox from "../components/Listbox";
import DateComponent from "../components/DateComponent";
import TextArea from "../components/TextArea";
import DocumentAttach from "../components/DocumentAttach";
import DatabaseServices from "../backend/DatabaseServices";
import ContractForm from "../components/ContractForm";


const AddForm = ({navigation}:any) => {


const handleSub = async (formData: Record<string, any>, documents: any[]) => {
console.log("FINAL formData before submit:", formData);
    try {
      const contractData = {
        employee_id: formData.e || '',
        employee_name: formData.employee_name || '',
        contract_type: formData.ct || '',
        contract_title: formData.title || '',
        start_date: formData.st || '',
        end_date: formData.en || '',
        employee_type: formData.et || '',
        employee_category: formData.ec || '',
        grade: formData.g || '',
        grade_step: formData.egs || '',
        station: formData.s || '',
        department: formData.d || '',
        designation: formData.d2 || '',
        performance: formData.p || '',
        description: formData.desc || '',
        notes: formData.notes || '',
        custom_fields: JSON.stringify(formData.CustomField_130 || {}),


      };

    
      const contractId = await DatabaseServices.createContract(contractData, documents);

      if (contractId) {
        Alert.alert(
          'Success',
          'Contract created successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
        console.log('Contract created with ID:', contractId);
      } else {
        Alert.alert('Error', 'Failed to save contract. Please try again.');
      }
    } catch (error) {
      console.error('Error saving contract:', error);
      Alert.alert('Error', 'Failed to save contract. Please try again.');
    }
  ;


   

};
  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Discard this contract?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.goBack() }
      ]
    );
  };
return(
  <ContractForm onSubmit={handleSub} mode="add" onCancel={handleCancel} />
)

}

export default AddForm;