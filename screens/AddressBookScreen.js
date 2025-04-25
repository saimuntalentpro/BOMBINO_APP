import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { apiCall } from '../auth/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddressBookScreen = ({ navigation }) => {
  const [addressBooks, setAddressBooks] = useState([]);
  const [query, setQuery] = useState('');

  const fetchAddressBooks = async (q = '') => {
    try {
      const response = await apiCall(`customer/address-book?q=${q}`, 'GET');
      if (response.status === 200) {
        setAddressBooks(response.data);
      }
    } catch (error) {
      console.log('Address book fetch error:', error);
    }
  };

  useEffect(() => {
    fetchAddressBooks();
  }, []);

  const handleSearch = () => {
    fetchAddressBooks(query);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteAddress(id) }
      ]
    );
  };
  
  const deleteAddress = async (id) => {
    try {
      const response = await apiCall(`customer/address-book/${id}`, 'DELETE');
      if (response.data.status === 200) {
        fetchAddressBooks();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the address.');
    }
  };

  const AddressCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.company_name}</Text>

      <View style={styles.detailRow}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{item.name}</Text></View>
      <View style={styles.detailRow}><Text style={styles.label}>Country:</Text><Text style={styles.value}>{item.country}</Text></View>
      <View style={styles.detailRow}><Text style={styles.label}>City:</Text><Text style={styles.value}>{item.city}</Text></View>
      <View style={styles.detailRow}><Text style={styles.label}>Address:</Text><Text style={styles.value}>{item.address}</Text></View>
      <View style={styles.detailRow}><Text style={styles.label}>Postal Code:</Text><Text style={styles.value}>{item.postal_code}</Text></View>
      <View style={styles.detailRow}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{item.email}</Text></View>
      <View style={styles.detailRow}><Text style={styles.label}>Contact:</Text><Text style={styles.value}>{item.contact}</Text></View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('AddressBook', { editData: item })}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Address Book</Text>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search by name or company"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={addressBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <AddressCard item={item} />}
      />

      {/* + Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddressBook', { editData: null })}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default AddressBookScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },

  searchRow: { flexDirection: 'row', marginBottom: 16 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D9DEFF',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F9FAFF',
  },
  searchButton: {
    backgroundColor: '#2E3192',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchButtonText: { color: '#fff', fontWeight: '600' },

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEF0FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#202020' },

  detailRow: { flexDirection: 'row', marginBottom: 4 },
  label: { fontWeight: '600', width: 110, fontSize: 12, color: '#505050' },
  value: { fontSize: 12, color: '#202020', flex: 1 },

  actions: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  detailText: { fontSize: 12, color: '#2E3192' },
  editButton: { borderWidth: 1, borderColor: '#28A745', hoverColor: '#28A745', borderRadius: 30, paddingHorizontal: 60, paddingVertical: 4 },
  editText: { fontSize: 12, color: '#28A745' },
  deleteButton: { borderWidth: 1, borderColor: '#E74C3C', borderRadius: 30, paddingHorizontal: 60, paddingVertical: 4 },
  deleteText: { fontSize: 12, color: '#E74C3C' },

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
});
