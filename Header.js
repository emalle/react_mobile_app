import React from 'react';
import { Appbar } from 'react-native-paper';
import { auth } from './firebaseConfig';


const Header = ({ navigation }) => {

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('LogIn');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <Appbar.Header style={{ height: 40 }} elevated={true}>
            <Appbar.Content
                title="Bandit"
                titleStyle={{ fontSize: 30, fontWeight: 'bold', color: 'black' }}
            />
            <Appbar.Action icon="star" onPress={() => navigation.navigate('Favorites')} />
            <Appbar.Action icon="account-circle" onPress={() => navigation.navigate('Settings')} />
            <Appbar.Action icon="logout" onPress={handleLogout} />
        </Appbar.Header>
    );
};


export default Header;

