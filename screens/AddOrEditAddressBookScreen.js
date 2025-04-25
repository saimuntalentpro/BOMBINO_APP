import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { countries } from './../constants/countries';
import { apiCall } from '../auth/auth';

const AddOrEditAddressBookScreen = ({ navigation }) => {
  const route = useRoute();
  const editData = route.params?.editData || null;

  const [type, setType] = useState(editData?.type || 'Sender');
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    email: '',
    address: '',
    country: '',
    city: '',
    postal_code: '',
    contact: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        company_name: editData.company_name || '',
        email: editData.email || '',
        address: editData.address || '',
        country: editData.country || '',
        city: editData.city || '',
        postal_code: editData.postal_code || '',
        contact: editData.contact || '',
      });
      setType(editData.type || 'Sender');
    } else {
      setFormData({
        name: '',
        company_name: '',
        email: '',
        address: '',
        country: '',
        city: '',
        postal_code: '',
        contact: '',
      });
      setType('Sender');
    }
  }, [editData]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = { ...formData, type };
    try {
      if (editData) {
        await apiCall(`customer/address-book/${editData.id}`, 'PUT', payload);
      } else {
        await apiCall(`customer/address-book`, 'POST', payload);
      }
      navigation.goBack();
    } catch (error) {
      alert('Something went wrong.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editData ? 'Edit Address' : 'Add New Address'}</Text>

      <View style={styles.radioGroup}>
        {['Sender', 'Receiver'].map(option => (
          <TouchableOpacity key={option} style={styles.radioButton} onPress={() => setType(option)}>
            <View style={[styles.radioCircle, type === option && styles.radioSelected]} />
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {Object.entries(formData).map(([key, value]) => {
        if (key === 'country') {
          return (
            <View key={key} style={styles.pickerWrapper}>
              <RNPickerSelect
                onValueChange={(val) => handleChange(key, val)}
                value={value}
                placeholder={{ label: 'Select Country', value: '' }}
                items={countries}
                style={{
                  inputAndroid: styles.pickerInput,
                  inputIOS: styles.pickerInput,
                }}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          );
        }

        return (
          <TextInput
            key={key}
            placeholder={key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            value={value}
            onChangeText={(text) => handleChange(key, text)}
            style={styles.input}
          />
        );
      })}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{editData ? 'Update Address' : 'Add Address'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddOrEditAddressBookScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#D9DEFF', borderRadius: 8, padding: 10, marginBottom: 10 },
  pickerWrapper: { borderWidth: 1, borderColor: '#D9DEFF', borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
  pickerInput: { padding: 12, color: '#000', fontSize: 14 },
  submitButton: { backgroundColor: '#2E3192', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontWeight: '600' },
  radioGroup: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  radioButton: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  radioCircle: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#2E3192', marginRight: 5 },
  radioSelected: { backgroundColor: '#2E3192' },
  radioLabel: { color: '#505050', fontSize: 14 },
});
