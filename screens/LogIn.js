import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import i18n from '../translation';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';


const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isRememberMe, setIsRememberMe] = useState(false);

    useEffect(() => {
        const checkCredentials = async () => {
            const savedEmail = await AsyncStorage.getItem('email');
            const savedPassword = await AsyncStorage.getItem('password');
            const rememberMe = await AsyncStorage.getItem('rememberMe');

            if (savedEmail && savedPassword && rememberMe === 'true') {
                setEmail(savedEmail);
                setPassword(savedPassword);
                setIsRememberMe(true);
            }
        };
        checkCredentials();
    }, []);

    useEffect(() => {
        i18n.locale = selectedLanguage;
    }, [selectedLanguage]);

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Welcome', userCredential.user);
            if (isRememberMe) {
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('password', password);
                await AsyncStorage.setItem('rememberMe', 'true');
            } else {
                await AsyncStorage.removeItem('email');
                await AsyncStorage.removeItem('password');
                await AsyncStorage.setItem('rememberMe', 'false');
            }
            navigation.navigate('Home');
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.message);
        }
    };
    const changeLanguage = (lang) => {
        if (lang) {
            i18n.locale = lang;
            setSelectedLanguage(lang);
            setDropdownVisible(false);
        }
    };

    return (
        <ImageBackground source={require('../assets/concert.jpg')} style={styles.background}>

            <View style={styles.languagePicker}>
                <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                    <Ionicons name="earth" size={35} color="white" style={{ marginTop: 5 }} />
                </TouchableOpacity>
                {dropdownVisible && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity style={styles.languageOption} onPress={() => changeLanguage('en')}>
                            <Text style={styles.languageText}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.languageOption} onPress={() => changeLanguage('fi')}>
                            <Text style={styles.languageText}>Suomi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.languageOption} onPress={() => changeLanguage('sv')}>
                            <Text style={styles.languageText}>Svenska</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Text style={styles.brandName}>Bandit</Text>

            <View style={styles.container}>
                <Text style={styles.title}>{i18n.t('login')}</Text>

                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>{i18n.t('login')}</Text>
                </TouchableOpacity>


                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>{i18n.t('noAccount')} {'   '}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signupLink}>{i18n.t('signup')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={isRememberMe ? 'checked' : 'unchecked'}
                        onPress={() => setIsRememberMe(!isRememberMe)} // Toggle the state
                    />
                    <Text style={styles.checkboxLabel}>{i18n.t('rememberMe')}</Text>
                </View>
            </View>
        </ImageBackground>);
};

export default LoginScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandName: {
        position: 'absolute',
        top: 60,
        left: 30,
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        zIndex: 2,
    },
    container: {
        position: 'absolute',
        width: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    loginButton: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupLink: {
        color: 'black',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    languagePicker: {
        position: 'absolute',
        top: 50,
        right: 30,
        zIndex: 5,
    },
    dropdown: {
        position: 'absolute',
        top: 45,
        right: 0,
        backgroundColor: 'black',
        borderRadius: 5,
        width: 150,
        paddingVertical: 10,
        zIndex: 10,
    },
    languageOption: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    languageText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    checkboxLabel: {
        fontSize: 14,
        marginLeft: 10,
    },
});
