import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Welcome', userCredential.user);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.message);
        }
    };

    return (
        <ImageBackground

            source={require('../assets/concert.jpg')}
            style={styles.background}
        >
            <Text style={styles.brandName}>Bandit</Text>

            <View style={styles.container}>
                <Text style={styles.title}>Log In</Text>

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
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>


                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>
                        Don't have an account?{' '}
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.signupLink}>Sign Up!</Text>
                        </TouchableOpacity>
                    </Text>
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
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

