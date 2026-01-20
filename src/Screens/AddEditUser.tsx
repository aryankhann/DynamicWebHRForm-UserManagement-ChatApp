import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Switch,
  ActivityIndicator,
  Modal,
  Platform
} from 'react-native';
import { launchImageLibrary, launchCamera, ImageLibraryOptions } from 'react-native-image-picker';
import DatabaseService from '../db/DatabaseServices';
import TextUI from '../components/TextUI';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faImage } from '@fortawesome/free-solid-svg-icons';
const AddUserScreen = ({ navigation,user,route }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    is_active: true,
    user_image: '',
    role: 'user' as 'admin' | 'user',
  });
const {userRegister} = route.params
console.log('role: ',userRegister)
  const [imagePickerModal, setImagePickerModal] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async (source: 'camera' | 'gallery') => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 500,
        maxWidth: 500,
      };

      const response = await (source === 'camera' ? launchCamera(options) : launchImageLibrary(options));
      setImagePickerModal(false);
      
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        Alert.alert('Error', `Failed to pick image`);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.base64) {
          const base64Image = `data:${asset.type};base64,${asset.base64}`;
          handleInputChange('user_image', base64Image);
        } else if (asset.uri) {
          handleInputChange('user_image', asset.uri);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return false;
    }

    if (!formData.password) {
      Alert.alert('Validation Error', 'Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const userId = await DatabaseService.createUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number.trim(),
        password: formData.password,
        is_active: formData.is_active,
        user_image: formData.user_image,
        role: formData.role,
      });

      if (userId) {
        Alert.alert('Success', 'User created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', 'Email already exists or failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create user');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TextUI style={styles.headerTitle} text={!userRegister ? 'Add New User' : 'Create your account'}></TextUI>
        <TextUI style={styles.headerSubtitle} text={!userRegister ? 'Fill in the user details' : 'Add your details'}></TextUI>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.imageSection}>
          {formData.user_image ? (
            <Image source={{ uri: formData.user_image }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <TextUI style={styles.profileImagePlaceholderText} text=                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}>
              </TextUI>
            </View>
          )}
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={() => setImagePickerModal(true)}
          >
            <View style={{flexDirection:'row'}}>
            <Text style={styles.imagePickerButtonText}> Choose Photo</Text>
          </View>
          </TouchableOpacity>
         
        </View>

        <View style={styles.inputGroup}>
          <TextUI text='Name' style={styles.label}>
             <Text style={styles.required}>*</Text>
          </TextUI>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextUI text='Email' style={styles.label}>
             <TextUI style={styles.required} text='*'></TextUI>
          </TextUI>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextUI style={styles.label} text='Phone Number'></TextUI>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={formData.phone_number}
            onChangeText={(text) => handleInputChange('phone_number', text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextUI text='Password' style={styles.label}>
             <TextUI style={styles.required} text='*'></TextUI>
          </TextUI>
          <TextInput
            style={styles.input}
            placeholder="Enter password (min 6 characters)"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <TextUI text='Confirm Password' style={styles.label}>
             <TextUI style={styles.required} text='*'></TextUI>
          </TextUI>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            secureTextEntry
          />
        </View>

       { !userRegister && <><View style={styles.inputGroup}>
          <TextUI style={styles.label} text='Role'></TextUI>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[styles.roleButton, formData.role === 'user' && styles.roleButtonActive]}
              onPress={() => handleInputChange('role', 'user')}
            >
              <TextUI text='User' style={[styles.roleButtonText, formData.role === 'user' && styles.roleButtonTextActive]}>
                
              </TextUI>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, formData.role === 'admin' && styles.roleButtonActive]}
              onPress={() => handleInputChange('role', 'admin')}
            >
              <TextUI text='Admin' style={[styles.roleButtonText, formData.role === 'admin' && styles.roleButtonTextActive]}>
                
              </TextUI>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.switchGroup}>
          <View style={styles.switchLabel}>
            <TextUI style={styles.label} text='Active Status'></TextUI>
            <TextUI style={styles.switchSubtext} text='User can log in and access the system'></TextUI>
          </View>
          <Switch
            value={formData.is_active}
            onValueChange={(value) => handleInputChange('is_active', value)}
            trackColor={{ false: '#D1D5DB', true: '#0C64AE' }}
            thumbColor="white"
          />
        </View></>}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <TextUI style={styles.cancelButtonText} text='Cancel'></TextUI>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <TextUI style={styles.submitButtonText} text='Create User'></TextUI>
          </TouchableOpacity>
        </View>
      </View>

      <ImagePickerModal
        visible={imagePickerModal}
        onClose={() => setImagePickerModal(false)}
        onSelectGallery={() => handleImagePicker('gallery')}
      />
    </ScrollView>
  );
};

const EditUserScreen = ({ navigation, route }: any) => {
  const { userId } = route.params;
  const [loading, setLoading] = useState(true);
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    is_active: true,
    user_image: '',
    role: 'user' as 'admin' | 'user',
  });

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await DatabaseService.getUserById(userId);
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          phone_number: user.phone_number || '',
          password: '',
          is_active: user.is_active,
          user_image: user.user_image || '',
          role: user.role,
        });
      } else {
        Alert.alert('Error', 'User not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading user:', error);
      Alert.alert('Error', 'Failed to load user');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async (source: 'camera' | 'gallery') => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 500,
        maxWidth: 500,
      };

      const response = await (source === 'camera' ? launchCamera(options) : launchImageLibrary(options));
      setImagePickerModal(false);
      
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        Alert.alert('Error', `Failed to pick image`);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.base64) {
          const base64Image = `data:${asset.type};base64,${asset.base64}`;
          handleInputChange('user_image', base64Image);
        } else if (asset.uri) {
          handleInputChange('user_image', asset.uri);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return false;
    }

    if (formData.password && formData.password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updateData: any = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number.trim(),
        is_active: formData.is_active,
        user_image: formData.user_image,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const success = await DatabaseService.updateUser(userId, updateData);

      if (success) {
        Alert.alert('Success', 'User updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', 'Email already exists or failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update user');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0C64AE" />
        <Text style={styles.loadingText}>Loading user...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TextUI style={styles.headerTitle} text='Edit User'></TextUI>
        <TextUI style={styles.headerSubtitle} text='Update user information'></TextUI>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.imageSection}>
          {formData.user_image ? (
            <Image source={{ uri: formData.user_image }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <TextUI style={styles.profileImagePlaceholderText} text=                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}>
              </TextUI>
            </View>
          )}
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={() => setImagePickerModal(true)}
          >
            <View style={{flexDirection:'row'}}>
            <TextUI style={styles.imagePickerButtonText} text="Choose Photo"> </TextUI>
          </View>
          </TouchableOpacity>
          <TextInput
            style={styles.imageInput}
            placeholder="Or paste image URL (optional)"
            value={formData.user_image}
            onChangeText={(text) => handleInputChange('user_image', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextUI text='Name' style={styles.label}>
             <TextUI text='*' style={styles.required}></TextUI>
          </TextUI>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextUI style={styles.label} text='Email'>
             <TextUI style={styles.required} text='*'></TextUI>
          </TextUI>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextUI style={styles.label} text='Phone Number'></TextUI>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={formData.phone_number}
            onChangeText={(text) => handleInputChange('phone_number', text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextUI style={styles.label} text='Password'></TextUI>
          <TextInput
            style={styles.input}
            placeholder="Enter new password (min 6 characters)"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <TextUI style={styles.label} text='Role'></TextUI>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[styles.roleButton, formData.role === 'user' && styles.roleButtonActive]}
              onPress={() => handleInputChange('role', 'user')}
            >
              <TextUI text='User' style={[styles.roleButtonText, formData.role === 'user' && styles.roleButtonTextActive]}>
                
              </TextUI>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, formData.role === 'admin' && styles.roleButtonActive]}
              onPress={() => handleInputChange('role', 'admin')}
            >
              <TextUI text='Admin' style={[styles.roleButtonText, formData.role === 'admin' && styles.roleButtonTextActive]}>
                
              </TextUI>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.switchGroup}>
          <View style={styles.switchLabel}>
            <TextUI style={styles.label} text='Active Status'></TextUI>
            <TextUI style={styles.switchSubtext} text='User can log in and access the system'></TextUI>
          </View>
          <Switch
            value={formData.is_active}
            onValueChange={(value) => handleInputChange('is_active', value)}
            trackColor={{ false: '#D1D5DB', true: '#0C64AE' }}
            thumbColor="white"
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <TextUI style={styles.cancelButtonText} text='Cancel'></TextUI>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <TextUI style={styles.submitButtonText} text='Update User'></TextUI>
          </TouchableOpacity>
        </View>
      </View>

      <ImagePickerModal
        visible={imagePickerModal}
        onClose={() => setImagePickerModal(false)}
        onSelectGallery={() => handleImagePicker('gallery')}
      />
    </ScrollView>
  );
};

const ImagePickerModal = ({ visible, onClose, onSelectCamera, onSelectGallery }: any) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TextUI style={styles.modalTitle} text='Choose Photo Source'></TextUI>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>

       

          <TouchableOpacity style={styles.modalOption} onPress={onSelectGallery}>
            <FontAwesomeIcon icon={faImage} size={36} style={{marginRight:20}}></FontAwesomeIcon>
            <View>
              <TextUI style={styles.modalOptionTitle} text='Choose from Gallery'></TextUI>
              <TextUI style={styles.modalOptionSubtitle} text='Select from your device'></TextUI>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={onClose}
          >
            <Text style={styles.modalCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0C64AE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileImagePlaceholderText: {
    fontSize: 40,
    fontWeight: '600',
    color: 'white',
  },
  imagePickerButton: {
    backgroundColor: '#0C64AE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  imagePickerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  imageInput: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#0C64AE',
    backgroundColor: '#EFF6FF',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  roleButtonTextActive: {
    color: '#0C64AE',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  switchLabel: {
    flex: 1,
  },
  switchSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  submitButton: {
    backgroundColor: '#0C64AE',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#6B7280',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalOptionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  modalOptionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  modalCancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export { AddUserScreen, EditUserScreen };