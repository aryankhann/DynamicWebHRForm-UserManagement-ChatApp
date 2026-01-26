import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import ButtonBlue from "../components/ButtonBlue";
import { useState, useEffect } from "react";
import TextUI from "../components/TextUI";
import FormTextField from "../components/FormTextField";
import Listbox from "../components/Listbox";
import DateComponent from "../components/DateComponent";
import TextArea from "../components/TextArea";
import DocumentAttach from "../components/DocumentAttach";
import { faAngleLeft, faAngleRight, faPaperclip, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface FormSection {
  Category: string;
  Data: FormField[];
}

interface FormField {
  Title: string;
  sFieldType: string;
  sFieldName: string;
  bRequiredField: boolean | string;
  aValues: any[];
  sDefaultValue: string;
  aAdditionalParams?: any;
}

interface ApiResponse {
  Status: number;
  Data?: FormSection[];
  Instructions?: string;
  AdditionalParams?: any;
  Message?: string;
}

interface ContractFormProps {
  mode: 'add' | 'edit' | 'view';
  contractId?: number;
  initialData?: Record<string, any>;
  toggle?: boolean;
  approved?:boolean,
  onSubmit: (formData: Record<string, any>, documents: any[]) => void;
  onCancel?: () => void;
  onApprovedCancel?: () =>void;
}

const ContractForm = ({ 
  mode, 
  contractId, 
  initialData,
  toggle, 
  onSubmit, 
  onCancel,
  approved,
  onApprovedCancel
}: ContractFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState<Record<number, any[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleValue = approved;
  const isViewMode = mode === 'view';

  useEffect(() => {
    fetchFormConfiguration();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (formSections.length > 0 && formData.e && !formData.employee_name) {
      formSections.forEach((section) => {
        section.Data.forEach((field) => {
          if (field.sFieldType === 'Employees' && field.aAdditionalParams?.DefaultMetaInfo) {
            const employeeInfo = field.aAdditionalParams.DefaultMetaInfo[formData.e];
            if (employeeInfo) {
              setFormData((prev) => ({
                ...prev,
                employee_name: employeeInfo.Value,
              }));
            }
          }
        });
      });
    }
  }, [formSections, formData.e]);

  const extractJsonFromResponse = (responseText: string): ApiResponse | null => {
    try {
      const jsonMatch = responseText.match(/\{"Status":\d+.*?\}(?=<script|$)/s);
      
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        return JSON.parse(jsonString);
      }
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error extracting JSON:', error);
      return null;
    }
  };

  const extractEmployeeData = (responseText: string) => {
    try {
      const employeeMatch = responseText.match(/aEmployees\[(\d+)\]\s*=\s*Array\((.*?)\);/g);
      
      if (employeeMatch) {
        const employees: Record<number, any[]> = {};
        
        employeeMatch.forEach((match) => {
          const idMatch = match.match(/aEmployees\[(\d+)\]/);
          const dataMatch = match.match(/Array\((.*?)\)/);
          
          if (idMatch && dataMatch) {
            const employeeId = parseInt(idMatch[1]);
            const dataStr = dataMatch[1];
            const values = dataStr.split(',').map(val => {
              val = val.trim();
              if (val.startsWith('"') && val.endsWith('"')) {
                return val.slice(1, -1);
              }
              return val;
            });
            employees[employeeId] = values;
          }
        });
        
        setEmployeeData(employees);
      }
    } catch (error) {
      console.error('Error extracting employee data:', error);
    }
  };

  const fetchFormConfiguration = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      console.log('toggle value from contracts screen: ', approved);
      
      const response = await fetch(toggle ? toggleValue 
        ? 'https://dev2.webhr.co/mobile/api/?m=Employees_Resignations&type2=details&ac=EditRecord&t=nnEwJXWvhteBvnoK7mvaF5lvWOwVGOicV0aoHIXYpD7rxSS9YL3Hk2YG9Ny7LmpmJM9UoH8cG23EJr6wfzuoTxwYwMq4F5ajcRiIpHUSi7Ho79Ub4BcZXDWJRX%2FjbdoVz7UPbFjlTRjG7Ozl7k7q6ZNeQwWJrAWZAEl7XqzF62m8le5EKV4RM6uyoy57GH56Qn2MTIOZYoY29juti0ToprAFcNTtUuE5msfKb9hJxwBcT4lNxAbSXU2GbQTf0ht7XgS%2BtDm%2Bflof4M5vrHFC%2FA%3D%3D&org=dev2&id=86&fins=1'

        : 'https://dev2.webhr.co/mobile/api/?m=Employees_Contracts&type2=details&ac=AddNewRecord&t=nnEwJXWvhteBvnoK7mvaF5lvWOwVGOicV0aoHIXYpD7rxSS9YL3Hk2YG9Ny7LmpmJM9UoH8cG23EJr6wfzuoTxwYwMq4F5ajcRiIpHUSi7Ho79Ub4BcZXDWJRX%2FjbdoVzh3NArf1a2xSLnmOL7K1La2de2vQuA62jnkxV2AwL%2BkFyfKudhDfIZK8ft1DbDsj2NvdQqPfWEy%2FLllFWCpva7ctNodRnSS81aJFPG3auyauTJkd6QGDjWpX6R1khlubgvHlCvWQ%2B7BhGVjArDy5EQ%3D%3D&org=dev2&fins=1'
      :'https://dev2.webhr.co/mobile/api/?m=Employees_Contracts&type2=details&ac=AddNewRecord&t=nnEwJXWvhteBvnoK7mvaF5lvWOwVGOicV0aoHIXYpD7rxSS9YL3Hk2YG9Ny7LmpmJM9UoH8cG23EJr6wfzuoTxwYwMq4F5ajcRiIpHUSi7Ho79Ub4BcZXDWJRX%2FjbdoVzh3NArf1a2xSLnmOL7K1La2de2vQuA62jnkxV2AwL%2BkFyfKudhDfIZK8ft1DbDsj2NvdQqPfWEy%2FLllFWCpva7ctNodRnSS81aJFPG3auyauTJkd6QGDjWpX6R1khlubgvHlCvWQ%2B7BhGVjArDy5EQ%3D%3D&org=dev2&fins=1' );
      
      const responseText = await response.text();
      const result = extractJsonFromResponse(responseText);
      
      if (result && result.Status === 0) {
        setErrorMessage(result.Message || "Unable to process this request");
        setLoading(false);
        return;
      }
      
      extractEmployeeData(responseText);
      
      if (result && result.Status === 1 && result.Data) {
        setFormSections(result.Data);
        
        if (mode === 'add' && !initialData) {
          const defaults: Record<string, any> = {};
          result.Data.forEach((section: FormSection) => {
            section.Data.forEach((field: FormField) => {
              if (field.sDefaultValue) {
                defaults[field.sFieldName] = field.sDefaultValue;
              }
            });
          });
          setFormData(defaults);
        }
      } else {
        Alert.alert('Error', 'Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching form configuration:', error);
      Alert.alert('Error', 'Failed to load form configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    if (isViewMode) return;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (fieldName === 'e' && employeeData[value]) {
      const empData = employeeData[value];
      setFormData((prev) => ({
        ...prev,
        d2: empData[1],
        g: empData[2],
        s: empData[3],
        d: empData[4],
        et: empData[5],
        ec: empData[6],
        egs: empData[7],
      }));
    }
  };

  const handleDocumentSelect = (document: any) => {
    if (isViewMode) return;
    setSelectedDocuments((prev) => [...prev, document]);
  };

  const handleSubmit = () => {
    if (isViewMode) return;

    let missingFields: string[] = [];
    
    formSections.forEach((section) => {
      section.Data.forEach((field) => {
        const isRequired = field.bRequiredField === true || field.bRequiredField === "1";
        if (isRequired && !formData[field.sFieldName]) {
          missingFields.push(field.Title);
        }
      });
    });

    if (missingFields.length > 0) {
      Alert.alert(
        'Required Fields Missing',
        `Please fill in: ${missingFields.join(', ')}`
      );
      return;
    }

    console.log('Form Data before submit:', formData);
    console.log('Employee ID:', formData.e);
    console.log('Employee Name:', formData.employee_name);

    onSubmit(formData, selectedDocuments);
  };

  const renderField = (field: FormField, key: any) => {
    const fieldName = field.sFieldName;
    const value = formData[fieldName] || '';
    const isRequired = field.bRequiredField === true || field.bRequiredField === "1";

    return (
      <View style={styles.fieldContainer} key={key}>
        <Text style={styles.fieldLabel}>
          {field.Title}
          {isRequired && !isViewMode && <Text style={styles.required}> *</Text>}
        </Text>

        {field.sFieldType === "text" && (
          <FormTextField
            pholder={`Enter ${field.Title}`}
            value={value}
            onChangeText={(text) => handleFieldChange(fieldName, text)}
            editable={!isViewMode}
          />
        )}

        {field.sFieldType === "listbox" && (
          <Listbox
            options={field.aValues.map(([val, label]) => ({
              value: String(val),
              label: String(label),
            }))}
            selected={value}
            onSelect={(selectedValue) => handleFieldChange(fieldName, selectedValue)}
            disabled={isViewMode}
          />
        )}

        {field.sFieldType === "date" && (
          <DateComponent
            label={field.Title}
            date={formData[fieldName] ? new Date(formData[fieldName]) : undefined}
            onDateChange={(date) => 
              handleFieldChange(fieldName, date?.toISOString().split('T')[0])
            }
            disabled={isViewMode}
          />
        )}

        {field.sFieldType === "textarea" && (
          <TextArea
            value={value}
            onChangeText={(text) => handleFieldChange(fieldName, text)}
            editable={!isViewMode}
          />
        )}

        {field.sFieldType === "EditorRedactor" && (
          <TextArea
            value={value}
            onChangeText={(text) => handleFieldChange(fieldName, text)}
            editable={!isViewMode}
          />
        )}

        {field.sFieldType === "attachment" && !isViewMode && (
          <View>
            <DocumentAttach onDocumentSelect={handleDocumentSelect} />
            {selectedDocuments.length > 0 && (
              <View style={styles.documentsList}>
                {selectedDocuments.map((doc, index) => (
                  <TextUI key={index} text={doc.name} style={styles.documentItem}>
                    <FontAwesomeIcon icon={faPaperclip} />
                  </TextUI>
                ))}
              </View>
            )}
          </View>
        )}

        {field.sFieldType === "attachment" && isViewMode && selectedDocuments.length > 0 && (
          <View style={styles.documentsList}>
            {selectedDocuments.map((doc, index) => (
              <TextUI text={doc.name} key={index} style={styles.documentItem}>
                <FontAwesomeIcon icon={faPaperclip} />
              </TextUI>
            ))}
          </View>
        )}

        {field.sFieldType === "Employees" && (
          <Listbox
            options={
              field.aAdditionalParams?.DefaultMetaInfo
                ? Object.entries(field.aAdditionalParams.DefaultMetaInfo).map(
                    ([key, val]: [string, any]) => ({
                      value: key,
                      label: val.Value,
                    })
                  )
                : []
            }
            selected={value}
            onSelect={(selectedValue) => handleFieldChange(fieldName, selectedValue)}
            disabled={isViewMode}
          />
        )}

        {(field.sFieldType === "addedby" || field.sFieldType === "addedon") && (
          <View style={styles.readOnlyField}>
            <TextUI style={styles.readOnlyText} text={field.sDefaultValue} />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0C64AE" />
        <TextUI style={styles.loadingText} text="Loading form..." />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={onApprovedCancel}>
              <FontAwesomeIcon icon={faAngleLeft as IconProp} size={24} style={{ marginTop: 5 }} />
            </TouchableOpacity>
            <TextUI text="Error" style={styles.headerTitle} />
          </View>
        </View>
        <View style={styles.errorContainer}>
          <View style={[styles.errorBox]}>
            <FontAwesomeIcon icon={faTriangleExclamation} size={30}></FontAwesomeIcon>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            {onCancel && (
              <View style={styles.errorButtonContainer}>
                <ButtonBlue text="Go Back" onNext={onApprovedCancel} />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  const getHeaderText = () => {
    switch (mode) {
      case 'add': return 'Create Contract';
      case 'edit': return 'Edit Contract';
      case 'view': return 'View Contract';
      default: return 'Contract';
    }
  };

  const getSubtitleText = () => {
    switch (mode) {
      case 'add': return 'Fill in the details below';
      case 'edit': return 'Update contract information';
      case 'view': return 'Contract details';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.header}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={onCancel}>
              <FontAwesomeIcon icon={faAngleLeft as IconProp} size={24} style={{ marginTop: 5 }} />
            </TouchableOpacity>
            <TextUI text={getHeaderText()} style={styles.headerTitle} />
          </View>
          <Text style={[styles.headerSubtitle, { marginLeft: 26 }]}>{getSubtitleText()}</Text>
        </View>

        {formSections.map((section, index) => (
          <View style={styles.section} key={index}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <TextUI text={section.Category} style={styles.sectionTitle} />
            </View>
            <View style={styles.sectionContent}>
              {section.Data.map((field, key) => renderField(field, key))}
            </View>
          </View>
        ))}

        {!isViewMode && (
          <View style={styles.buttonRow}>
            <View style={[styles.buttonWrapper, onCancel && styles.buttonFlex]}>
              <ButtonBlue 
                text={mode === 'add' ? "Create Contract" : "Update Contract"} 
                onNext={handleSubmit} 
              />
            </View>
          </View>
        )}

        {isViewMode && onCancel && (
          <View style={styles.section}>
            <ButtonBlue text="Close" onNext={onCancel} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "400",
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    marginTop:10
  },
  errorButtonContainer: {
    width: '100%',
    marginTop: 8,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 4,
    height: 24,
    backgroundColor: "#0C64AE",
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  sectionContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  required: {
    color: '#EF4444',
  },
  readOnlyField: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  readOnlyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  documentsList: {
    marginTop: 12,
    gap: 8,
  },
  documentItem: {
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  buttonFlex: {
    flex: 2,
  },
});

export default ContractForm;