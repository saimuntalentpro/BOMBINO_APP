import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { apiCall } from '../auth/auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const MyParcelScreen = () => {
  const [parcels, setParcels] = useState([]);
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState(null);

  const navigation = useNavigation();

  const fetchParcels = async () => {
    try {
      let url = `/customer/parcel`;
      const params = [];
      if (query) params.push(`q=${query}`);
      if (fromDate) params.push(`from_date=${formatDate(fromDate)}`);
      if (toDate) params.push(`to_date=${formatDate(toDate)}`);
      if (params.length) url += `?${params.join('&')}`;

      const response = await apiCall(url, 'GET');
      console.log("my parcel list :",response);

      if (response.status === 200) {
        setParcels(response.data.records);
      }
    } catch (error) {
      console.error('Fetch parcels error:', error);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const openPicker = (target) => {
    setDatePickerTarget(target);
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (datePickerTarget === 'from') setFromDate(selectedDate);
      if (datePickerTarget === 'to') setToDate(selectedDate);
    }
  };

  const ParcelRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.air_way_bill}</Text>
      <Text style={styles.cell}>{item.sender_company_name}</Text>
      <Text style={styles.cell}>{item.receiver_company_name}</Text>
      <Text style={styles.cell}>{item.weight}</Text>
      <Text style={styles.cell}>{item.type}</Text>
      <Text style={styles.cell}>{item.currency}</Text>
      <Text style={styles.cell}>{item.price}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.parcel_status}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditParcel', { parcelId: item.id })}
      >
        <Ionicons name="create-outline" size={18} color="#2E3192" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Parcel List</Text>

      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Search by AWB or Company"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => openPicker('from')} style={styles.dateBtn}>
            <Text style={styles.dateText}>{fromDate ? formatDate(fromDate) : 'From Date'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPicker('to')} style={styles.dateBtn}>
            <Text style={styles.dateText}>{toDate ? formatDate(toDate) : 'To Date'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={fetchParcels}>
          <Text style={styles.filterText}>Search</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={new Date()}
          onChange={handleDateChange}
        />
      )}

      <View style={styles.tableHeader}>
        {['AWB', 'Sender', 'Receiver', 'Weight', 'Type', 'Cur.', 'Price', 'Status', 'Action'].map((h, i) => (
          <Text key={i} style={styles.headerCell}>{h}</Text>
        ))}
      </View>

      <FlatList
        data={parcels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ParcelRow item={item} />}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddParcel')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12, color: '#202020' },
  filterContainer: { marginBottom: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D9DEFF',
    backgroundColor: '#F9FAFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  dateContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dateBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D9DEFF',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F9FAFF',
  },
  dateText: { fontSize: 14, color: '#505050' },
  filterBtn: { backgroundColor: '#2E3192', padding: 12, borderRadius: 8, alignItems: 'center' },
  filterText: { color: '#fff', fontWeight: '600' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EEF0FF',
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 5,
  },
  headerCell: {
    flex: 1,
    fontSize: 11,
    color: '#505050',
    fontWeight: '600',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FFF',
  },
  cell: {
    flex: 1,
    fontSize: 11,
    color: '#505050',
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#2E3192',
    borderRadius: 20,
    alignSelf: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10 },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2E3192',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  editButton: {
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyParcelScreen;