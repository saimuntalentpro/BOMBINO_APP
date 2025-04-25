import React from 'react';
import { View, TextInput, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const ItemForm = ({ item, index, onChange, styles }) => (
  <View style={styles.itemCard}>

    <TextInput
      placeholder="PCS"
      style={styles.input}
      value={item.pcs?.toString() || ''}
      onChangeText={(text) => {
        const number = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
        onChange('items', 'pcs', number, index);
      }}
      keyboardType="numeric"
    />

    <TextInput placeholder="Weight" style={styles.input} value={item.weight} onChangeText={(text) => onChange('items', 'weight', text, index)} />
    <TextInput placeholder="Height" style={styles.input} value={item.height} onChangeText={(text) => onChange('items', 'height', text, index)} />
    <TextInput placeholder="Length" style={styles.input} value={item.length} onChangeText={(text) => onChange('items', 'length', text, index)} />
    <TextInput placeholder="Width" style={styles.input} value={item.width} onChangeText={(text) => onChange('items', 'width', text, index)} />

    <TextInput placeholder="Dimension" editable={false} style={[styles.input, { backgroundColor: '#F0F0F0' }]} value={item.dimension} />

    <TextInput placeholder="Reference" style={styles.input} value={item.reference} onChangeText={(text) => onChange('items', 'reference', text, index)} />
    <TextInput placeholder="VAT/EORI" style={styles.input} value={item.vat} onChangeText={(text) => onChange('items', 'vat', text, index)} />

    <View style={styles.pickerWrapper}>
      <RNPickerSelect
        onValueChange={(value) => onChange('items', 'type', value, index)}
        items={[{ label: 'IPX', value: 'IPX' }, { label: 'IDX', value: 'IDX' }]}
        placeholder={{ label: 'Select Type', value: '' }}
        value={item.type}
        style={{ inputAndroid: styles.pickerInput, inputIOS: styles.pickerInput }}
        useNativeAndroidPickerStyle={false}
      />
    </View>

    <View style={styles.pickerWrapper}>
      <RNPickerSelect
        onValueChange={(value) => onChange('items', 'paid_by', value, index)}
        items={[{ label: 'Shipper', value: 'Shipper' }, { label: 'Consignee', value: 'Consignee' }]}
        placeholder={{ label: 'Paid By', value: '' }}
        value={item.paid_by}
        style={{ inputAndroid: styles.pickerInput, inputIOS: styles.pickerInput }}
        useNativeAndroidPickerStyle={false}
      />
    </View>

    <View style={styles.pickerWrapper}>
      <RNPickerSelect
        onValueChange={(value) => onChange('items', 'ac', value, index)}
        items={[{ label: 'Cash', value: 'Cash' }, { label: 'Others', value: 'Others' }]}
        placeholder={{ label: 'Account Type', value: '' }}
        value={item.ac}
        style={{ inputAndroid: styles.pickerInput, inputIOS: styles.pickerInput }}
        useNativeAndroidPickerStyle={false}
      />
    </View>

    {item.ac === 'Others' && (
      <TextInput placeholder="A/C No" style={styles.input} value={item.ac_no} onChangeText={(text) => onChange('items', 'ac_no', text, index)} />
    )}

    <TextInput placeholder="Price" style={styles.input} value={item.price} onChangeText={(text) => onChange('items', 'price', text, index)} />
    <TextInput placeholder="Description" multiline numberOfLines={3} style={[styles.input, { height: 60 }]} value={item.description} onChangeText={(text) => onChange('items', 'description', text, index)} />
  </View>
);

export default ItemForm;