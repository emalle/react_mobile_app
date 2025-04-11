import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";  // for Realtime Database

const firebaseConfig = {
    apiKey: "AIzaSyDR37VZxE9acH1UwAeuh0XaG-WAYBwmWK0",
    authDomain: "bandit-54918.firebaseapp.com",
    databaseURL: "https://bandit-54918-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bandit-54918",
    storageBucket: "bandit-54918.firebasestorage.app",
    messagingSenderId: "150262461364",
    appId: "1:150262461364:web:7f3e2c07df8f8df24038e1"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const database = getDatabase(app);

export { auth, database, app };