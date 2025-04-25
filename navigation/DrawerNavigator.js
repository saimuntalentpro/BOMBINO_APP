import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DashboardScreen from '../screens/DashboardScreen';
import MyParcelScreen from '../screens/MyParcelScreen';
import AddressBookScreen from '../screens/AddressBookScreen';
import AddOrEditAddressBookScreen from '../screens/AddOrEditAddressBookScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import AddParcelScreen from '../screens/AddParcelScreen';
import EditParcelScreen from '../screens/EditParcelScreen';
import ProfilePictureUploader from '../components/profile/ProfileImageUpload';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const user = global.userData || {
    name: 'Guest User',
    profile_photo: null,
  };

  const handleLogout = () => {
    global.authToken = null;
    global.userData = null;
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const getIcon = (label) => {
    switch (label) {
      case 'Dashboard': return 'grid-outline';
      case 'My Parcel': return 'cube-outline';
      case 'Address Book': return 'book-outline';
      case 'Profile Settings': return 'settings-outline';
      case 'Logout': return 'log-out-outline';
      default: return 'ellipse-outline';
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <ProfilePictureUploader user={user} navigation={props.navigation} /> 
      </View>

      <View style={styles.menuSection}>
        {props.state.routes.map((route, index) => {
          const hiddenScreens = ['AddressBook', 'AddParcel','EditParcel'];
          if (hiddenScreens.includes(route.name)) return null;

          const focused = props.state.index === index;
          const label = props.descriptors[route.key].options.drawerLabel ?? route.name;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, focused && styles.menuItemActive]}
              onPress={() => props.navigation.navigate(route.name)}
            >
              <Ionicons name={getIcon(label)} size={18} color={focused ? '#fff' : '#505050'} style={{ marginRight: 8 }} />
              <Text style={[styles.menuText, focused && styles.menuTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }]}>
          <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="My Parcel" component={MyParcelScreen} />
      <Drawer.Screen name="Address Book" component={AddressBookScreen} />
      <Drawer.Screen name="AddressBook" component={AddOrEditAddressBookScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="AddParcel" component={AddParcelScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="EditParcel" component={EditParcelScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Profile Settings" component={ProfileSettingsScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2E3192',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  menuSection: {
    flex: 1,
    marginTop: 20,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemActive: {
    backgroundColor: '#2E3192',
  },
  menuText: {
    fontSize: 14,
    color: '#505050',
    fontWeight: '500',
  },
  menuTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 0,
    backgroundColor: '#2E3192',
    borderRadius: 28,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
