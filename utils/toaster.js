import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

let toastUpdater;

export const triggerToast = (message, type = 'success') => {
    if (toastUpdater) {
        toastUpdater({ visible: true, message, type });
        setTimeout(() => {
            toastUpdater({ visible: false, message: '', type: '' });
        }, 2000);
    }
};

export const Toast = ({ toast, setToast }) => {
    toastUpdater = setToast;

    if (!toast.visible) return null;

    return (
        <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
            <Text style={styles.toastText}>{toast.message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        zIndex: 999,
    },
    toastSuccess: {
        backgroundColor: '#000',
    },
    toastError: {
        backgroundColor: '#E53935',
    },
    toastText: {
        color: '#fff',
        fontWeight: '600',
    },
});