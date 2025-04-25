import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiCall } from '../auth/auth';
import SenderForm from '../components/parcel/SenderForm';
import ReceiverForm from '../components/parcel/ReceiverForm';
import ItemForm from '../components/parcel/ItemForm';

const EditParcelScreen = ({ route, navigation }) => {
  const { parcelId } = route.params;

  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState(null);
  const [parcelData, setParcelData] = useState({
    sender: {},
    receiver: {},
    items: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const response = await apiCall(`customer/parcel/${parcelId}`, 'GET');
        if (response.status === 200) {
          setParcelData({
            sender: {
              id: response.data.sender?.id || null,
              company_name: response.data.sender?.company_name || '',
              name: response.data.sender?.name || '',
              country: response.data.sender?.country || '',
              city: response.data.sender?.city || '',
              address: response.data.sender?.address || '',
              postal_code: response.data.sender?.postal_code || '',
              email: response.data.sender?.email || '',
              contact: response.data.sender?.contact || '',
              pickup_request_date: response.data.sender?.pickup_request_date || '',
              pickup_request_time: response.data.sender?.pickup_request_time || '',
            },
            receiver: {
              id: response.data.receiver?.id || null,
              company_name: response.data.receiver?.company_name || '',
              name: response.data.receiver?.name || '',
              country: response.data.receiver?.country || '',
              city: response.data.receiver?.city || '',
              address: response.data.receiver?.address || '',
              postal_code: response.data.receiver?.postal_code || '',
              email: response.data.receiver?.email || '',
              contact: response.data.receiver?.contact || '',
            },
            items: response.data.parcel_items?.map(item => ({
              id: item.id || null,
              pcs: item.pcs || '',
              weight: item.weight || '',
              height: item.height || '',
              length: item.length || '',
              width: item.width || '',
              dimension: item.dimension || '',
              reference: item.reference || '',
              vat: item.vat || '',
              type: item.type || 'IPX',
              currency: item.currency || 'USD',
              paid_by: item.paid_by || '',
              ac: item.ac || 'Others',
              ac_no: item.ac_no || '',
              price: item.price || '',
              description: item.description || '',
            })) || [],
          });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchParcel();
  }, [parcelId]);

  const handleChange = (section, name, value, index = null) => {
    if (section === 'items' && index !== null) {
        const items = [...parcelData.items];
        items[index][name] = value;
        setParcelData({ ...parcelData, items });
    } 
    else if (section === 'sender' || section === 'receiver') {
        setParcelData({ ...parcelData, [section]: { ...parcelData[section], [name]: value } });
    }
  };

  const handleUpdate = async () => {
    try {
      const requestData = {
        sender: parcelData.sender,
        receiver: parcelData.receiver,
        parcel_items: parcelData.items.map(item => ({ ...item, id: item.id }))
      };
     
      const response = await apiCall(`customer/parcel/update/${parcelId}`, 'POST', requestData);
      
      if (response && response.status === 200) {
        Alert.alert('Success', 'Parcel updated successfully');
        navigation.navigate('My Parcel');
      } else {
        Alert.alert('Error', 'Failed to update parcel');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Parcel Form</Text>

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
          <ItemForm key={index} item={item} index={index} onChange={handleChange} styles={styles} />
        ))}
      </ScrollView>

      {/* DateTimePicker for date */}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={new Date(parcelData.sender.pickup_request_date || new Date())}
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) handleChange('sender', 'pickup_request_date', selectedDate.toISOString().split('T')[0]);
          }}
        />
      )}

      {/* DateTimePicker for time */}
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={new Date(parcelData.sender.pickup_request_time || new Date())}
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
          <TouchableOpacity onPress={() => setStep(step + 1)} style={styles.stepBtn}>
            <Text style={{ color: '#fff' }}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleUpdate} style={styles.stepBtn}>
            <Text style={{ color: '#fff' }}>Update Parcel</Text>
          </TouchableOpacity>
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

export default EditParcelScreen;
