import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const ProfilePictureUploader = ({ user, navigation }) => {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant gallery permission');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
    });

    if (!result.canceled) {
        uploadImage(result.assets[0]);
    }
   };

   const uploadImage = async (asset) => {
    setUploading(true);
    try {
        const uri = asset.uri;
        const blob = await (await fetch(uri)).blob();

        const formData = new FormData();
        formData.append('profile_photo', {
            uri,
            name: `profile_${Date.now()}.jpg`,
            type: blob.type || 'image/jpeg',
        });

        const response = await axios.post(
            'http://63.250.40.59:7080/api/v1/customer/profile/upload-profile-photo',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${global.authToken}`,
                },
            }
        );

        if (response.data?.status === 200) {
            global.userData.profile_photo = response.data.profile_photo_url;
            navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
        } else {
            Alert.alert('Upload Failed', 'Could not upload image.');
        }
    } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Error', 'Something went wrong');
    } finally {
        setUploading(false);
    }
   };


  return (
    <View style={styles.header}>
      <View>
        <Image
          source={user.profile_photo ? { uri: user.profile_photo } : require('../../assets/dummy-avatar.png')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={uploading}>
          {uploading ? <ActivityIndicator color="white" size="small" /> : <Ionicons name="camera" size={16} color="#fff" />}
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{user.name}</Text>
    </View>
  );
};

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
  uploadButton: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: '#2E3192',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default ProfilePictureUploader;