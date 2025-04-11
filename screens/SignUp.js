import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ImageBackground } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from "firebase/database";
import { auth, app } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { useContext } from 'react';
import { UserContext } from '../UserContext';


const SignUpScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        city: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { setUserData } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const navigation = useNavigation();

    const checkPasswordStrength = (password) => {
        if (password.length < 8) {
            setPasswordStrength('Weak');
        } else if (password.match(/[A-Z]/) && password.match(/[0-9]/)) {
            setPasswordStrength('Strong');
        } else {
            setPasswordStrength('Medium');
        }
    };

    // Reset the form fields
    const resetForm = () => {
        setFormData({
            name: '',
            surname: '',
            city: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    // Sign up process
    const signUp = async () => {
        const { name, surname, city, password, confirmPassword, email } = formData;

        if (!name || !surname || !city) {
            setErrorMessage('Name, Surname, and City are obligatory fields');
            resetForm();
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            resetForm();
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Welcome ", userCredential.user);

            const db = getDatabase(app);
            await set(ref(db, 'users/' + userCredential.user.uid), {
                name,
                surname,
                city,
                email
            });

            setUserData({ name, surname, city, email });
            navigation.navigate('Home');

            resetForm();
        } catch (error) {
            console.error("Error signing up:", error);
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('This email is already in use.');
            } else if (error.code === 'auth/weak-password') {
                setErrorMessage('Password should be at least 8 characters.');
            } else if (error.code === 'auth/invalid-email') {
                setErrorMessage('Invalid email address format.');
            } else {
                setErrorMessage('Please try again.');
            }
            resetForm();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../assets/concert.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <Text style={styles.brandName}>Bandit</Text>

                <View style={styles.container}>
                    {errorMessage ? (
                        <Text style={styles.error}>{errorMessage}</Text>
                    ) : null}

                    <TextInput
                        style={styles.input}
                        placeholder="*Name"
                        placeholderTextColor="#fff"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="*Surname"
                        placeholderTextColor="#fff"
                        value={formData.surname}
                        onChangeText={(text) => setFormData({ ...formData, surname: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="*City"
                        placeholderTextColor="#fff"
                        value={formData.city}
                        onChangeText={(text) => setFormData({ ...formData, city: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="*Email"
                        placeholderTextColor="#fff"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="*Password"
                        placeholderTextColor="#fff"
                        secureTextEntry
                        value={formData.password}
                        onChangeText={(text) => {
                            setFormData({ ...formData, password: text });
                            checkPasswordStrength(text);
                        }}
                    />
                    <Text style={styles.passwordStrength}>
                        Password Strength: {passwordStrength}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="*Confirm Password"
                        placeholderTextColor="#fff"
                        secureTextEntry
                        value={formData.confirmPassword}
                        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                    />

                    <Button title="Sign Up" onPress={signUp} />
                    <View style={styles.loginTextWrapper}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <Text
                            style={styles.loginLink}
                            onPress={() => navigation.navigate('LogIn')}
                        >
                            Log In
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 100,
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
        width: '85%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 15,
        marginTop: 50,
    },
    input: {
        height: 40,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingLeft: 10,
        color: '#fff',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    passwordStrength: {
        color: '#fff',
        marginBottom: 10,
    },
    loginTextWrapper: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
    },
    loginText: {
        color: '#fff',
    },
    loginLink: {
        color: '#fff',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
