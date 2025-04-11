import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps'; // the Marker gives me the pin with my location
import { FontAwesome } from '@expo/vector-icons';
import { saveToFavorites } from '../db';

const TICKETMASTER_API_KEY = 'OdCpG2WlzwUf2HaX0oX0OSolZyTdA7sQ';

const HomeScreen = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [concerts, setConcerts] = useState([]);
    const [searchCity, setSearchCity] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('No access');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);

            const geocode = await Location.reverseGeocodeAsync({ // Reverse geocoding gives me the name and address instead of coordinates
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            if (geocode.length > 0) {
                const city = geocode[0].city || geocode[0].region || 'Helsinki'; // Default to Helsinki if city not found
                fetchConcerts(loc.coords.latitude, loc.coords.longitude); // Fetch with geoPoint which was recommended in the API documentation
            }
        })();
    }, []);

    const fetchConcerts = async (latitude, longitude) => {
        try {
            const geoPoint = `${latitude},${longitude}`;

            const response = await fetch(
                `https://app.ticketmaster.com/discovery/v2/events.json?latlong=${geoPoint}&size=10&apikey=${TICKETMASTER_API_KEY}`
            );

            const data = await response.json();

            if (data._embedded && data._embedded.events) {
                setConcerts(data._embedded.events);
            } else {
                console.log('No concerts found. Sorry!');
            }
        } catch (error) {
            console.error('Error fetching concerts:', error);
        }
    };

    const handleCitySearch = async () => {
        fetchConcerts(searchCity);
    };

    const handleSaveToFavorites = (concert) => {
        saveToFavorites(concert);  // Save the concert to SQLite
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search by city"
                style={styles.input}
                value={searchCity}
                onChangeText={setSearchCity}
                onSubmitEditing={handleCitySearch}
            />
            <MapView
                style={styles.map}
                region={{
                    latitude: location?.coords.latitude || 60.1699,  // Helsinki latitude (default if location not available)
                    longitude: location?.coords.longitude || 24.9384,  // Helsinki longitude (default if location not available)
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: parseFloat(location?.coords.latitude) || 60.1699,  // Helsinki latitude (default if location not available)
                        longitude: parseFloat(location?.coords.longitude) || 24.9384,  // Helsinki longitude (default if location not available)
                    }}

                />
                {concerts.map((concert) => (
                    <Marker
                        key={concert.id}
                        coordinate={{
                            latitude: parseFloat(concert._embedded.venues[0].location.latitude),
                            longitude: parseFloat(concert._embedded.venues[0].location.longitude),
                        }}
                        title={concert.name}
                        description={concert._embedded.venues[0].name}
                        onPress={() => navigation.navigate('ConcertDetail', { concert })}
                    />
                ))}
            </MapView>
            <FlatList
                data={concerts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Pressable onPress={() => handleSaveToFavorites(item)} style={styles.starButton}>
                            <FontAwesome
                                name="star-o"  // This is an empty star that will get filled when clicked on
                                size={24}
                                color="gold"
                            />
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        padding: 10,
        backgroundColor: '#eee',
        margin: 10,
        borderRadius: 8,
    },
    map: {
        height: 200,
        margin: 10,
    },
    card: {
        padding: 15,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
    },
    title: {
        fontWeight: 'bold',
    },
});

