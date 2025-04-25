import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { countries } from "../../constants/countries";

const ReceiverForm = ({ data, onChange, openAddressBook, styles }) => (
  <>
    <TouchableOpacity onPress={openAddressBook} style={styles.addressBookButton}>
      <Ionicons name="book-outline" size={16} />
      <Text style={{ marginLeft: 6 }}>From Address Book</Text>
    </TouchableOpacity>
    <TextInput placeholder="Company Name" style={styles.input} value={data.company_name} onChangeText={(text) => onChange('company_name', text)} />
    <TextInput placeholder="Contact Name" style={styles.input} value={data.name} onChangeText={(text) => onChange('name', text)} />
    <View style={styles.pickerWrapper}>
      <RNPickerSelect onValueChange={(value) => onChange('country', value)} items={countries} placeholder={{ label: 'Select Country', value: '' }} value={data.country} style={{ inputAndroid: styles.pickerInput, inputIOS: styles.pickerInput }} useNativeAndroidPickerStyle={false} />
    </View>
    <TextInput placeholder="City" style={styles.input} value={data.city} onChangeText={(text) => onChange('city', text)} />
    <TextInput placeholder="Address" style={styles.input} value={data.address} onChangeText={(text) => onChange('address', text)} />
    <TextInput placeholder="Postal Code" style={styles.input} value={data.postal_code} onChangeText={(text) => onChange('postal_code', text)} />
    <TextInput placeholder="Email" style={styles.input} value={data.email} onChangeText={(text) => onChange('email', text)} />
    <TextInput placeholder="Contact Number" style={styles.input} value={data.contact} onChangeText={(text) => onChange('contact', text)} />
  </>
);

export default ReceiverForm;
