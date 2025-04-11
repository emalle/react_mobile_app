import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable } from 'react-native';
import { getFavorites, deleteFromFavorites } from '../db';

const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = () => {
        getFavorites((savedFavorites) => {
            setFavorites(savedFavorites);
        });
    };

    const handleDelete = (concertId) => {
        deleteFromFavorites(concertId);
        setFavorites(favorites.filter(favorite => favorite.concertId !== concertId)); // Update the local state
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.concertId}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.concertName}</Text>
                        <Text>{item.venueName}</Text>

                        <Pressable onPress={() => handleDelete(item.concertId)} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    card: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 5,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default FavoritesScreen;
