import React from 'react';
import { Appbar } from 'react-native-paper';
import { auth } from './firebaseConfig';
import { Text } from 'react-native';

const Header = ({ navigation }) => {

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <Appbar.Header style={{ height: 40 }} elevated={true}>
            <Appbar.Content
                title={
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'black' }}>
                        Bandit
                    </Text>
                }
            />
            <Appbar.Action icon="account-circle" onPress={() => navigation.navigate('Settings')} />
            <Appbar.Action icon="logout" onPress={handleLogout} />
        </Appbar.Header>
    );
};


export default Header;

