import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import ContractForm from '../components/ContractForm';
import DatabaseService from '../db/DatabaseServices';
import TextUI from '../components/TextUI';


const ViewForm = ({ navigation, route }: any) => {
  const { contractId } = route.params;
  const [initialData, setInitialData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContract();
  }, [contractId]);

  const loadContract = async () => {
    try {
      setLoading(true);
      const contract = await DatabaseService.getContractById(contractId);

      if (contract) {
        const formData = {
          e: contract.employee_id,
          employee_name: contract.employee_name,
          ct: contract.contract_type,
          title: contract.contract_title,
          st: contract.start_date,
          en: contract.end_date,
          et: contract.employee_type,
          ec: contract.employee_category,
          g: contract.grade,
          egs: contract.grade_step,
          s: contract.station,
          d: contract.department,
          d2: contract.designation,
          p: contract.performance,
          desc: contract.description,
          notes: contract.notes,
          CustomField_130: contract.custom_fields ? JSON.parse(contract.custom_fields) : {},
        };
        setInitialData(formData);

        const docs = await DatabaseService.getDocumentsByContractId(contractId);

        console.log('Loaded documents:', docs);
      } else {
        Alert.alert('Error', 'Contract not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading contract:', error);
      Alert.alert('Error', 'Failed to load contract');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0C64AE" />
        <TextUI style={styles.loadingText} text="Loading contract..."></TextUI>
      </View>
    );
  }

  return (
    <ContractForm
      mode="view"
      contractId={contractId}
      initialData={initialData || {}}
      onSubmit={handleSubmit}
      onCancel={handleClose}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});

export default ViewForm;