import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { apiCall } from '../auth/auth';

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState({
    total_shipments: 0,
    pending_shipments: 0,
    delivered_shipments: 0,
    recent_shipments: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiCall('customer/dashboard-data', 'GET');
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const statusColors = {
    "Shipment collected": { background: '#E6E9FF', border: '#D9DEFF', text: '#2E3192' },
    "Under customs clearance": { background: '#E6E9FF', border: '#D9DEFF', text: '#2E3192' },
    "In transit to destination": { background: '#FDF2E9', border: '#F5CBA7', text: '#E67E22' },
    "Delivered": { background: '#D5F5E3', border: '#82E0AA', text: '#28B463' },
    "Pending": { background: '#FADBD8', border: '#EC7063', text: '#E74C3C' },
  };

  const StatCard = ({ title, count }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardCount}>{count} <Text style={styles.lastMonth}>Last month</Text></Text>
    </View>
  );

  const renderShipment = ({ item }) => {
    const statusStyle = statusColors[item.parcel_status] || {};
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.air_way_bill}</Text>
        <Text style={styles.cell}>{item.sender_company_name}</Text>
        <Text style={styles.cell}>{item.receiver_company_name}</Text>
        <Text style={styles.cell}>{item.weight}</Text>
        <Text style={styles.cell}>{item.type}</Text>
        <Text style={styles.cell}>{item.currency}</Text>
        <Text style={styles.cell}>{item.price}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.background, borderColor: statusStyle.border }]}>
          <Text style={{ color: statusStyle.text, fontSize: 10 }}>{item.parcel_status}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Hello, Welcome back!</Text>
      <Text style={styles.subHeader}>Track your progress here</Text>

      {/* Stats */}
      <View style={styles.cardsContainer}>
        <StatCard title="Total Shipments" count={dashboardData.total_shipments} />
        <StatCard title="Pending Shipments" count={dashboardData.pending_shipments} />
        <StatCard title="Delivered Shipments" count={dashboardData.delivered_shipments} />
      </View>

      {/* Recent Shipments */}
      <Text style={styles.tableTitle}>Recent Shipments</Text>

      <View style={styles.tableHeader}>
        {["AWB", "Sender", "Receiver", "Weight", "Type", "Cur.", "Price", "Status"].map((h, i) => (
          <Text key={i} style={styles.headerCell}>{h}</Text>
        ))}
      </View>

      <FlatList
        data={dashboardData.recent_shipments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderShipment}
      />
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: '600', marginBottom: 4 },
  subHeader: { fontSize: 14, color: '#505050', marginBottom: 16 },
  cardsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: { flex: 1, borderWidth: 1, borderColor: '#D9DEFF', borderRadius: 10, padding: 12, marginHorizontal: 5, backgroundColor: '#fff' },
  cardTitle: { fontSize: 14, color: '#505050' },
  cardCount: { fontSize: 18, fontWeight: 'bold', marginTop: 6 },
  lastMonth: { fontSize: 10, color: '#707070' },

  tableTitle: { fontSize: 16, fontWeight: '600', marginVertical: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#EEF0FF', padding: 8, borderRadius: 5 },
  headerCell: { flex: 1, fontSize: 10, fontWeight: '600', color: '#505050', textAlign: 'center' },
  row: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#EEE' },
  cell: { flex: 1, fontSize: 10, color: '#505050', textAlign: 'center' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20, borderWidth: 1, alignSelf: 'center' },
});