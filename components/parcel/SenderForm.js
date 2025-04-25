import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { countries } from "../../constants/countries";

const SenderForm = ({ data, onChange, openAddressBook, openDatePicker, openTimePicker, styles }) => {
  const senderData = { 
    company_name: data.company_name || '',
    name: data.name || '',
    country: data.country || '',
    city: data.city || '',
    address: data.address || '',
    postal_code: data.postal_code || '',
    email: data.email || '',
    contact: data.contact || '',
    pickup_request_date: data.pickup_request_date || '',
    pickup_request_time: data.pickup_request_time || '',
  };

  console.log("sender data: ", senderData);

  return (
    <View>
      <TouchableOpacity onPress={openAddressBook} style={styles.addressBookButton}>
        <Ionicons name="book-outline" size={16} />
        <Text style={{ marginLeft: 6 }}>From Address Book</Text>
      </TouchableOpacity>

      <TextInput 
        placeholder="Company Name" 
        style={styles.input} 
        value={senderData.company_name} 
        onChangeText={(text) => onChange('company_name', text)} 
      />
      <TextInput 
        placeholder="Contact Name" 
        style={styles.input} 
        value={senderData.name} 
        onChangeText={(text) => onChange('name', text)} 
      />
      <View style={styles.pickerWrapper}>
        <RNPickerSelect
          onValueChange={(value) => onChange('country', value)}
          items={countries}
          placeholder={{ label: 'Select Country', value: '' }}
          value={senderData.country}
          style={{ inputAndroid: styles.pickerInput, inputIOS: styles.pickerInput }}
          useNativeAndroidPickerStyle={false}
        />
      </View>
      <TextInput 
        placeholder="City" 
        style={styles.input} 
        value={senderData.city} 
        onChangeText={(text) => onChange('city', text)} 
      />
      <TextInput 
        placeholder="Address" 
        style={styles.input} 
        value={senderData.address} 
        onChangeText={(text) => onChange('address', text)} 
      />
      <TextInput 
        placeholder="Postal Code" 
        style={styles.input} 
        value={senderData.postal_code} 
        onChangeText={(text) => onChange('postal_code', text)} 
      />
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={senderData.email} 
        onChangeText={(text) => onChange('email', text)} 
      />
      <TextInput 
        placeholder="Contact Number" 
        style={styles.input} 
        value={senderData.contact} 
        onChangeText={(text) => onChange('contact', text)} 
      />
      <TouchableOpacity onPress={openDatePicker} style={styles.input}>
        <Text>{senderData.pickup_request_date || 'Select Pickup Date'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openTimePicker} style={styles.input}>
        <Text>{senderData.pickup_request_time || 'Select Pickup Time'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SenderForm;