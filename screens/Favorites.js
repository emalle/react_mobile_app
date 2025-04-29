import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SQLiteContext } from '../SQLiteContext';
import Header from '../Header';

const FavoritesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);

    const { getFavorites, deleteFromFavorites } = React.useContext(SQLiteContext);


    useEffect(() => {
        const loadFavorites = async () => {
            const result = await getFavorites();
            setFavorites(result);
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
            <View style={styles.container}>
                {favorites.length === 0 ? (
                    <Text style={styles.noFavoritesText}>No favorite concerts yet!</Text>
                ) : (
                    <FlatList
                        data={favorites}
                        keyExtractor={(item, index) => item.concertId?.toString() || `fallback-${index}`}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.title}>{item.concertName}</Text>
                                <Text style={styles.venue}>{item.venueName}</Text>
                                <Pressable onPress={() => handleDelete(item.concertId)} style={styles.deleteButton}>
                                    <FontAwesome name="trash" size={20} color="red" />
                                </Pressable>
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    noFavoritesText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
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
