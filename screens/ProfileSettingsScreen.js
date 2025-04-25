import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { apiCall } from '../auth/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Toast, triggerToast } from '../utils/toaster';

const ProfileSettingsScreen = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    country: '',
    city: '',
    postal_code: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiCall('/customer/profile', 'GET');
      if (res && res.status === 200) {
        const { name, email, address, country, city, postal_code, phone } = res.data;
        const nameParts = (name || '').split(' ');
        setProfileData({
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
          email: email || '',
          address: address || '',
          country: country || '',
          city: city || '',
          postal_code: postal_code || '',
          phone: phone || '',
        });
      }
    } catch (error) {
      triggerToast('Failed to fetch profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        name: `${profileData.first_name} ${profileData.last_name}`.trim(),
        email: profileData.email,
        address: profileData.address,
        country: profileData.country,
        city: profileData.city,
        postal_code: profileData.postal_code,
        phone: profileData.phone,
      };
      await apiCall('/customer/profile/update', 'POST', payload);
      triggerToast('Profile updated successfully');
    } catch (error) {
      triggerToast('Profile update failed', 'error');
    }
  };

  const handleChangePassword = async () => {
    try {
      const payload = {
        current_password: passwordData.current_password,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation
      };
      await apiCall('/customer/change-password', 'POST', payload);
      triggerToast('Password changed successfully');
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
    } catch (error) {
      triggerToast('Password change failed', 'error');
    }
  };

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Toast toast={toast} setToast={setToast} />

      <View style={styles.tabContainer}>
        {['Account', 'Security'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Ionicons
              name={tab === 'Account' ? 'person-outline' : 'lock-closed-outline'}
              size={18}
              color={activeTab === tab ? '#2E3192' : '#888'}
              style={{ marginRight: 5 }}
            />
            <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Account' ? (
        <ScrollView>
          {Object.entries(profileData).map(([key, value]) => (
            <TextInput
              key={key}
              placeholder={key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              style={styles.input}
              value={value}
              onChangeText={text => setProfileData({ ...profileData, [key]: text })}
            />
          ))}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View>
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="Current Password"
              secureTextEntry={!showCurrent}
              style={[styles.input, { paddingRight: 40 }]}
              value={passwordData.current_password}
              onChangeText={t => setPasswordData({ ...passwordData, current_password: t })}
            />
            <TouchableOpacity
              onPress={() => setShowCurrent(p => !p)}
              style={{ position: 'absolute', right: 10, top: 12 }}
            >
              <Ionicons name={showCurrent ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="New Password"
              secureTextEntry={!showNew}
              style={[styles.input, { paddingRight: 40 }]}
              value={passwordData.password}
              onChangeText={t => setPasswordData({ ...passwordData, password: t })}
            />
            <TouchableOpacity
              onPress={() => setShowNew(p => !p)}
              style={{ position: 'absolute', right: 10, top: 12 }}
            >
              <Ionicons name={showNew ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!showConfirm}
              style={[styles.input, { paddingRight: 40 }]}
              value={passwordData.password_confirmation}
              onChangeText={t => setPasswordData({ ...passwordData, password_confirmation: t })}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm(p => !p)}
              style={{ position: 'absolute', right: 10, top: 12 }}
            >
              <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
            <Text style={styles.saveButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  tabContainer: { flexDirection: 'row', marginBottom: 15 },
  tab: { flex: 1, padding: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: 'transparent' },
  activeTab: { borderColor: '#2E3192' },
  tabText: { color: '#888' },
  activeTabText: { color: '#2E3192', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#D9DEFF', borderRadius: 8, padding: 10, marginBottom: 10 },
  saveButton: { backgroundColor: '#2E3192', padding: 12, alignItems: 'center', borderRadius: 8, marginTop: 10 },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DEFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  
});

export default ProfileSettingsScreen;