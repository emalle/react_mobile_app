import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { UserContext } from '../UserContext';

const SettingsScreen = () => {
    const { userData } = useContext(UserContext);

    return (
        <View>
            <Text>Name: {userData?.name}</Text>
            <Text>Email: {userData?.email}</Text>
            <Text>City: {userData?.city}</Text>
        </View>
    );
};

export default SettingsScreen;