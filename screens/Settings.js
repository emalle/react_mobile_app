import React, { useContext, useState } from 'react';
import { Text, TextInput, StyleSheet, ImageBackground, ScrollView, View, TouchableOpacity } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { UserContext } from '../UserContext';
import Header from '../Header';
import i18n from '../translation';
import { auth, updateEmail, updatePassword } from '../firebaseConfig';

const SettingsScreen = () => {
    const { userData, setUserData } = useContext(UserContext);

    const [form, setForm] = useState({
        name: userData?.name || '',
        surname: userData?.surname || '',
        city: userData?.city || '',
        email: userData?.email || '',
        password: '',
    });

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [editField, setEditField] = useState(null);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleFieldSave = async (field) => {
        try {
            const currentUser = auth.currentUser;

            if (field === 'email' && form.email !== userData.email) {
                await updateEmail(currentUser, form.email);
            }

            if (field === 'password' && form.password) {
                await updatePassword(currentUser, form.password);
            }

            setUserData(prev => ({
                ...prev,
                [field]: field === 'password' ? prev.password : form[field]
            }));

            setEditField(null);
            setSnackbarVisible(true);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    const renderField = (label, field, secure = false) => {
        const value = form[field] ?? userData?.[field] ?? '';

        return (
            <View style={styles.row}>
                {editField === field ? (
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={(val) => handleChange(field, val)}
                        secureTextEntry={secure}
                        placeholder={secure ? 'Enter new password' : `Edit ${label.toLowerCase()}`}
                    />
                ) : (
                    <Text style={styles.label}>
                        {`${label}: `}
                        {secure ? '••••••' : userData?.[field] || ''}
                    </Text>
                )}

                <TouchableOpacity
                    style={styles.editContainer}
                    onPress={() => {
                        if (editField === field) {
                            handleFieldSave(field);
                        } else {
                            setEditField(field);
                        }
                    }}
                >
                    <Text style={styles.editButton}>
                        {editField === field ? 'Save' : 'Edit'}
                    </Text>
                </TouchableOpacity>

                {editField === field && (
                    <TouchableOpacity
                        onPress={() => {
                            setForm(prev => ({ ...prev, [field]: userData[field] || '' }));
                            setEditField(null);
                        }}
                    >
                        <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <ImageBackground source={require('../assets/record-player.jpg')} style={styles.background}>
            <Header title={i18n.t('settings')} />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.greeting}>Hi, {userData?.name || 'User'}!</Text>
                {renderField('Name', 'name')}
                {renderField('Surname', 'surname')}
                {renderField('City', 'city')}
                {renderField('Email', 'email')}
                {renderField('Password', 'password', true)}

            </ScrollView>

            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={4000}>
                {i18n.t('settingsUpdated')}
            </Snackbar>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        padding: 20,
        paddingBottom: 100,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.85)',
        padding: 10,
        borderRadius: 10,
    },
    label: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    editContainer: {
        marginLeft: 10,
    },
    editButton: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    cancelButton: {
        color: 'red',
        marginLeft: 10,
    },
    greeting: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 30,
    },
});

export default SettingsScreen;
