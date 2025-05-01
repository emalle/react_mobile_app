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
            console.log('Fetched Favorites:', result);
            const filtered = result.filter(item => item?.concertId && item?.concertName);
            setFavorites(filtered);
        };

        loadFavorites();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'No Date Available';
        const date = new Date(dateString);
        if (isNaN(date)) return 'Invalid Date';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    const handleDelete = async (concertId) => {
        await deleteFromFavorites(concertId);
        setFavorites((prevFavorites) => prevFavorites.filter(concert => concert.concertId !== concertId));
    };
    const handleBuyTicket = (ticketUrl) => {
        if (ticketUrl && typeof ticketUrl === 'string') {
            Linking.openURL(ticketUrl).catch((err) => console.error('Failed to open URL:', err));
        } else {
            console.error('Invalid ticket URL:', ticketUrl);
        }
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
                                <Text style={styles.dateText}>{formatDate(item.date) || 'No Date Available'}</Text>
                                <Pressable onPress={() => handleDelete(item.concertId)} style={styles.deleteButton}>
                                    <FontAwesome name="trash" size={20} color="red" />
                                </Pressable>
                                <Pressable
                                    onPress={() => handleBuyTicket(item.url)}
                                    style={styles.buyButton}
                                >
                                    <Text style={styles.buyButtonText}>Buy Ticket</Text>
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
        backgroundColor: 'rgba(247, 243, 243, 0.7)',
        padding: 15,
        marginVertical: 10,
        borderRadius: 12,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    venue: {
        color: '#555',
        marginVertical: 5,
        fontSize: 14,
    },
    date: {
        color: '#888',
        marginVertical: 5,
        fontSize: 12,
    },
    deleteButton: {
        marginTop: 10,
        alignSelf: 'flex-start',
        padding: 8,
        backgroundColor: '#ffdddd',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});

export default FavoritesScreen;
