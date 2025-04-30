import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, Pressable, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SQLiteContext } from '../SQLiteContext';
import Header from '../Header';

const FavoritesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);

    const { getFavorites, deleteFromFavorites } = React.useContext(SQLiteContext);


    useEffect(() => {
        const loadFavorites = async () => {
            const result = await getFavorites();
            const filtered = result.filter(item => item?.concertId && item?.concertName);
            setFavorites(filtered);
        };

        loadFavorites();
    }, []);


    const handleDelete = async (concertId) => {
        await deleteFromFavorites(concertId);
        setFavorites((prevFavorites) => prevFavorites.filter(concert => concert.concertId !== concertId));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header navigation={navigation} />
            <ImageBackground
                source={require('../assets/concert.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                {favorites.length === 0 ? (
                    <Text style={styles.noFavoritesText}>No favorite concerts yet!</Text>
                ) : (
                    <FlatList
                        data={favorites}
                        keyExtractor={(item, index) => item.concertId ? item.concertId.toString() : `fallback-${index}`} contentContainerStyle={{ padding: 20 }}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.title}>{item.concertName || 'Unnamed Concert'}</Text>
                                <Text style={styles.venue}>{item.venueName || 'Unknown Venue'}</Text>
                                <Pressable onPress={() => handleDelete(item.concertId)} style={styles.deleteButton}>
                                    <FontAwesome name="trash" size={20} color="red" />
                                </Pressable>
                            </View>
                        )}
                    />
                )}
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFavoritesText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        borderRadius: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    venue: {
        color: '#555',
        marginVertical: 5,
    },
    deleteButton: {
        marginTop: 10,
        alignSelf: 'flex-start',
        padding: 5,
        backgroundColor: '#ffdddd',
        borderRadius: 5,
    },
});


export default FavoritesScreen;
