import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import DatabaseService, { Contract } from '../backend/DatabaseServices';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
 faBackspace,
 faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import TextUI from '../components/TextUI';
interface ContractListScreenProps {
  navigation: any;
}

const ContractScreen = ({ navigation }: ContractListScreenProps) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
const [toggle,setToggle]= useState(false)

const handleToggle  = ()=>{

  setToggle((prev)=>!prev)

}

  useEffect(() => {
    loadContracts();

    const unsubscribe = navigation.addListener('focus', () => {
      loadContracts();
    });

    return unsubscribe;
  }, [navigation]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const allContracts = await DatabaseService.getAllContracts();
      setContracts(allContracts);
      console.log(allContracts)
      
    } catch (error) {
      console.error('Error loading contracts:', error);
      Alert.alert('Error', 'Failed to load contracts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadContracts();
  };

  const handleAddContract = () => {
    navigation.navigate('AddForm');
  };

  const handleViewContract = (contractId: number) => {
    navigation.navigate('ViewForm', { contractId });
  };

  const handleEditContract = (contractId: number,approved:boolean) => {
    navigation.navigate('EditForm', { contractId,approved,toggle });
  };

  const handleDeleteContract = async (contractId: number, contractTitle: string) => {
    Alert.alert(
      'Delete Contract',
      `Are you sure you want to delete "${contractTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await DatabaseService.deleteContract(contractId);
              if (success) {
                Alert.alert('Success', 'Contract deleted successfully');
                loadContracts();
              } else {
                Alert.alert('Error', 'Failed to delete contract');
              }
            } catch (error) {
              console.error('Error deleting contract:', error);
              Alert.alert('Error', 'Failed to delete contract');
            }
          },
        },
      ]
    );
  };

  const renderContractItem = ({ item }: { item: Contract }) => (
    
    <TouchableOpacity 
      style={styles.contractCard}
      onPress={() => handleViewContract(item.id!)}
      activeOpacity={0.7}
    >
   <View style={styles.contractHeader}>
  <View style={styles.contractInfo}>
    <TextUI style={styles.contractTitle} text={item.contract_title || 'Untitled Contract'}></TextUI>
    <TextUI style={styles.employeeName} text={item.employee_name|| 'Unknown Employee'}></TextUI>
  </View>
  <View style={styles.statusContainer}>
    <View style={styles.statusBadge}>
      <TextUI style={styles.statusText} text='Active'></TextUI>
    </View>
    <View style={[styles.statusBadge, item.approved ? styles.approvedBadge : styles.unapprovedBadge]}>
      <TextUI style={[styles.statusText, item.approved ? styles.approvedText : styles.unapprovedText]} text={item.approved ? 'Approved' : 'Unapproved'}></TextUI>
    </View>
  </View>
</View>

      <View style={styles.contractDetails}>
        <View style={styles.detailRow}>
          <TextUI style={styles.detailLabel} text='Start Date:'></TextUI>
          <TextUI style={styles.detailValue} text={item.start_date || 'N/A'}></TextUI>
        </View>
        <View style={styles.detailRow}>
          <TextUI style={styles.detailLabel} text="End Date:"></TextUI>
          <TextUI style={styles.detailValue} text={item.end_date || 'N/A'}></TextUI>
        </View>
        
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={(e) => {
            e.stopPropagation();
            handleViewContract(item.id!);
          }}
        >
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={(e) => {
            e.stopPropagation();
            handleEditContract(item.id!,item.approved!);
            console.log('approved test: ',item.approved)
          }}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteContract(item.id!, item.contract_title || 'this contract');
          }}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0C64AE" />
        <Text style={styles.loadingText}>Loading contracts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
  <FontAwesomeIcon icon={faArrowLeft as IconProp} size={24} />
        </TouchableOpacity>
        <TextUI style={styles.headerTitle} text='Contracts'></TextUI>
        <TouchableOpacity style={styles.addButton} onPress={handleAddContract}>
          <TextUI style={styles.addButtonText} text='+ Add Contract'></TextUI>
        </TouchableOpacity>
      </View>
      <View style={{width:'100%',alignItems:'center',marginTop:'5%'}}>
<View style={{flexDirection:'row',width:'90%',justifyContent:'space-between',alignItems:'center'}}>
        
        <Text>Disable editing on approved records</Text>
        <Switch trackColor={{false: '#767577',true: '#81b0ff'}}
                thumbColor={toggle ? '#f4f3f4' : '#f4f3f4'}
                onValueChange={handleToggle}
                value={toggle}
        ></Switch>
        </View>
      </View>
      {contracts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TextUI style={styles.emptyText} text="No contracts found"></TextUI>
          <TextUI style={styles.emptySubtext} text="Tap 'Add Contract' to create one"></TextUI>
        </View>
      ) : (
        <FlatList
          data={contracts}
          renderItem={renderContractItem}
          keyExtractor={(item) => item.id!.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
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
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#0C64AE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  contractCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contractInfo: {
    flex: 1,
  },
  contractTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  employeeName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contractType: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    height: 24,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  contractDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#6366F1',
  },
  editButton: {
    backgroundColor: '#0C64AE',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  deleteButtonText: {
    color: '#DC2626',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  statusContainer: {
  gap: 5,
  alignItems: 'flex-end',
  justifyContent:'center'
},
approvedBadge: {
  backgroundColor: '#D1FAE5',
},
unapprovedBadge: {
  backgroundColor: '#FEF3C7',
},
approvedText: {
  color: '#065F46',
},
unapprovedText: {
  color: '#92400E',
},
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default ContractScreen;