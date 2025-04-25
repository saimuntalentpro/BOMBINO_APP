import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiCall } from '../auth/auth';
import SenderForm from '../components/parcel/SenderForm';
import ReceiverForm from '../components/parcel/ReceiverForm';
import ItemForm from '../components/parcel/ItemForm';

const AddParcelScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState(null);

  const [parcelData, setParcelData] = useState({
    sender: { company_name: '', name: '', country: '', city: '', address: '', postal_code: '', email: '', contact: '', pickup_request_date: '', pickup_request_time: '' },
    receiver: { company_name: '', name: '', country: '', city: '', address: '', postal_code: '', email: '', contact: '' },
    items: [{ pcs: '', weight: '', height: '', length: '', width: '', dimension: '', reference: '', vat: '', type: 'IPX', currency: 'USD', paid_by: '', ac: 'Others', ac_no: '', price: '', description: '' }],
  });

  const isSenderValid = () => Object.values(parcelData.sender).slice(0, 8).every(v => v.trim() !== '');

  const handleChange = (section, name, value, index = null) => {
    if (section === 'items' && index !== null) {
      const items = [...parcelData.items];
      items[index][name] = value;
      if (["height", "width", "length"].includes(name)) {
        const h = parseFloat(items[index].height) || 0;
        const w = parseFloat(items[index].width) || 0;
        const l = parseFloat(items[index].length) || 0;
        items[index].dimension = ((h * w * l) / 5000).toFixed(2);
      }
      setParcelData({ ...parcelData, items });
    } else {
      setParcelData({ ...parcelData, [section]: { ...parcelData[section], [name]: value } });
    }
  };

  const handleSubmit = async () => {
    try {
      const { items, ...dataWithoutItems } = parcelData;
      const requestData = { ...dataWithoutItems, parcel_items: items };
      const response = await apiCall("customer/parcel/create", "POST", requestData);
      if (response && response.status === 200) {
        alert("Parcel Added Successfully");
        navigation.navigate('My Parcel');
      } else {
        alert("Failed to add parcel");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Parcel Form</Text>

      <View style={styles.stepperRow}>
        {['Sender', 'Receiver', 'Item'].map((label, i) => (
          <React.Fragment key={i}>
            <View style={styles.stepIndicator}>
              <View style={[styles.circle, step > i ? styles.activeCircle : styles.inactiveCircle]} />
              <Text style={[styles.stepLabel, step > i ? styles.activeStepText : styles.inactiveStepText]}>{label}</Text>
            </View>
            {i < 2 && <View style={[styles.stepLine, step > i ? styles.activeLine : styles.inactiveLine]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={styles.formSection}>
        {step === 1 && (
          <SenderForm
            data={parcelData.sender}
            onChange={(name, value) => handleChange('sender', name, value)}
            openAddressBook={() => {}}
            openDatePicker={() => { setDatePickerTarget('pickup_request_date'); setShowDatePicker(true); }}
            openTimePicker={() => { setDatePickerTarget('pickup_request_time'); setShowTimePicker(true); }}
            styles={styles}
          />
        )}

        {step === 2 && (
          <ReceiverForm
            data={parcelData.receiver}
            onChange={(name, value) => handleChange('receiver', name, value)}
            openAddressBook={() => {}}
            styles={styles}
          />
        )}

        {step === 3 && parcelData.items.map((item, index) => (
          <ItemForm
            key={index}
            item={item}
            index={index}
            onChange={handleChange}
            styles={styles}
          />
        ))}
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={new Date()}
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) handleChange('sender', 'pickup_request_date', selectedDate.toISOString().split('T')[0]);
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={new Date()}
          onChange={(e, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              const h = selectedDate.getHours().toString().padStart(2, '0');
              const m = selectedDate.getMinutes().toString().padStart(2, '0');
              handleChange('sender', 'pickup_request_time', `${h}:${m}`);
            }
          }}
        />
      )}

      <View style={styles.btnRow}>
        {step > 1 && (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.stepBtn}>
            <Text style={{ color: '#fff' }}>Previous</Text>
          </TouchableOpacity>
        )}
        {step < 3 ? (
          <TouchableOpacity disabled={step === 1 && !isSenderValid()} onPress={() => setStep(step + 1)} style={[styles.stepBtn, step === 1 && !isSenderValid() && { opacity: 0.5 }]}> <Text style={{ color: '#fff' }}>Next</Text></TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stepBtn} onPress={handleSubmit}><Text style={{ color: '#fff' }}>Submit</Text></TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  stepIndicator: { alignItems: 'center' },
  circle: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#ccc' },
  activeCircle: { backgroundColor: '#2E3192' },
  inactiveCircle: { backgroundColor: '#ccc' },
  stepLabel: { fontSize: 10, marginTop: 4 },
  activeStepText: { color: '#2E3192' },
  inactiveStepText: { color: '#999' },
  stepLine: { height: 2, flex: 1, marginHorizontal: 4 },
  activeLine: { backgroundColor: '#2E3192' },
  inactiveLine: { backgroundColor: '#ccc' },
  formSection: { flex: 1 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
  addressBookButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  stepBtn: { padding: 10, backgroundColor: '#2E3192', borderRadius: 6 },
  pickerInput: { padding: 12, color: '#000', fontSize: 14 },
});

export default AddParcelScreen;