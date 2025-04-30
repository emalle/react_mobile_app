import React from 'react';
import { Appbar } from 'react-native-paper';
import { auth } from './firebaseConfig';
import { Pressable, Text, View } from 'react-native';


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
        <Appbar.Header style={{ height: 40, justifyContent: 'space-between', paddingHorizontal: 10 }} elevated={true}>
            <Pressable onPress={() => navigation.navigate('Home')}>
                <Text style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: 'black',
                    marginLeft: 10,
                }}>
                    Bandit
                </Text>
            </Pressable>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Appbar.Action icon="star" onPress={() => navigation.navigate('Favorites')} />
                <Appbar.Action icon="account-circle" onPress={() => navigation.navigate('Settings')} />
                <Appbar.Action icon="logout" onPress={handleLogout} />
            </View>
        </Appbar.Header >
    );
};


export default Header;

