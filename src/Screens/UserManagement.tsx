import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import DatabaseService, { User } from '../backend/DatabaseServices';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faPhone } from '@fortawesome/free-solid-svg-icons';
import TextUI from '../components/TextUI';

const UserManagementScreen = ({ navigation }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();

    const unsubscribe = navigation.addListener('focus', () => {
      loadUsers();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await DatabaseService.getAllUsersForAdmin();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleAddUser = () => {
    navigation.navigate('AddUser',{
      userRegister:false
    });
  };

  const handleEditUser = (userId: number) => {
    navigation.navigate('EditUser', { userId });
  };

  const handleToggleStatus = async (userId: number, userName: string, isActive: boolean) => {
    Alert.alert(
      `${isActive ? 'Deactivate' : 'Activate'} User`,
      `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isActive ? 'Deactivate' : 'Activate',
          style: isActive ? 'destructive' : 'default',
          onPress: async () => {
            const success = await DatabaseService.toggleUserStatus(userId);
            if (success) {
              Alert.alert('Success', `User ${isActive ? 'deactivated' : 'activated'} successfully`);
              loadUsers();
            } else {
              Alert.alert('Error', 'Failed to update user status');
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await DatabaseService.deleteUser(userId);
            if (success) {
              Alert.alert('Success', 'User deleted successfully');
              loadUsers();
            } else {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userImageContainer}>
          {item.user_image ? (
            <Image source={{ uri: item.user_image }} style={styles.userImage} />
          ) : (
            <View style={styles.userImagePlaceholder}>
              <TextUI style={styles.userImagePlaceholderText} text={item.name.charAt(0).toUpperCase()}>
                
              </TextUI>
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <TextUI style={styles.userName} text={item.name}></TextUI>
            <View style={[styles.roleBadge, item.role === 'admin' && styles.adminBadge]}>
              <TextUI text={item.role} style={[styles.roleText, item.role === 'admin' && styles.adminRoleText]}>
                
              </TextUI>
            </View>
          </View>
          <TextUI style={styles.userEmail} text={item.email}></TextUI>
          {item.phone_number && (<View style={{flexDirection:'row'}}>
          <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                      <Text style={styles.userPhone}> {item.phone_number}</Text>

         </View> )}
        </View>

        <View style={[styles.statusBadge, item.is_active ? styles.activeBadge : styles.inactiveBadge]}>
          <TextUI text={item.is_active ? 'Active' : 'Inactive'} style={[styles.statusText, item.is_active ? styles.activeText : styles.inactiveText]}>
            
          </TextUI>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditUser(item.id!)}
        >
          <TextUI style={styles.actionButtonText} text='Edit'></TextUI>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, item.is_active ? styles.deactivateButton : styles.activateButton]}
          onPress={() => handleToggleStatus(item.id!, item.name, item.is_active)}
        >
          <TextUI style={[styles.actionButtonText, !item.is_active && styles.activateButtonText]} text=            {item.is_active ? 'Deactivate' : 'Activate'}
>
          </TextUI>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteUser(item.id!, item.name)}
        >
          <TextUI style={[styles.actionButtonText, styles.deleteButtonText]} text='Delete'></TextUI>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0C64AE" />
        <TextUI style={styles.loadingText} text='Loading users...'></TextUI>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 8 }}
          >
            <FontAwesomeIcon icon={faAngleLeft} size={20} />
          </TouchableOpacity>
        
          <TextUI style={styles.headerTitle} text='User Management'></TextUI>
        </View>
       
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name, email, or phone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={{width:'100%',flexDirection:'row-reverse'}}>
 <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <TextUI style={styles.addButtonText} text="+ Add User"></TextUI>
        </TouchableOpacity>
        </View>
      {filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TextUI style={styles.emptyText} text='No users found'></TextUI>
          <TextUI style={styles.emptySubtext} text={searchQuery ? 'Try a different search' : 'Tap "Add User" to create one'}>
          </TextUI>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
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
    paddingTop: 80,
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
    width:'30%',
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    marginRight:20,marginTop:15,
  
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userImageContainer: {
    marginRight: 12,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0C64AE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImagePlaceholderText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  roleBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadge: {
    backgroundColor: '#FEF3C7',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    textTransform: 'capitalize',
  },
  adminRoleText: {
    color: '#92400E',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    height: 24,
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#065F46',
  },
  inactiveText: {
    color: '#991B1B',
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
  editButton: {
    backgroundColor: '#0C64AE',
  },
  deactivateButton: {
    backgroundColor: 'red',
  },
  activateButton: {
    backgroundColor: '#10B981',
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
  activateButtonText: {
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
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default UserManagementScreen;