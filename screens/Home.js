import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';

import { saveToFavorites } from '../db';
import Header from '../Header';
import i18n from '../translation';
import DateTimePicker from '@react-native-community/datetimepicker';

const TICKETMASTER_API_KEY = 'OdCpG2WlzwUf2HaX0oX0OSolZyTdA7sQ';

const HomeScreen = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);
    const [concerts, setConcerts] = useState([]);
    const [searchCity, setSearchCity] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [favoriteConcertIds, setFavoriteConcertIds] = useState(new Set());

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('No access');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);

            setMapRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.0322,
                longitudeDelta: 0.0221,
            });
        })();
    }, []);

    const fetchConcerts = async (cityName, date) => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const startDateTime = `${formattedDate}T00:00:00Z`;
            const endDateTime = `${formattedDate}T23:59:59Z`;

            const response = await fetch(
                `https://app.ticketmaster.com/discovery/v2/events.json?city=${encodeURIComponent(cityName)}&startDateTime=${startDateTime}&endDateTime=${endDateTime}&size=10&apikey=${TICKETMASTER_API_KEY}`
            );

            const data = await response.json();

            setHasSearched(true);

            if (data._embedded && data._embedded.events) {
                const concertEvents = data._embedded.events.filter(event =>
                    event.classifications &&
                    event.classifications.some(classification => classification.segment.name === 'Music')
                );
                setConcerts(concertEvents);
            } else {
                setConcerts([]);
            }
        } catch (error) {
            console.error('Error fetching concerts:', error);
        }
    };

    const handleCitySearch = async () => {
        try {
            if (!searchCity.trim()) return;

            const geocoded = await Location.geocodeAsync(searchCity);
            if (geocoded.length > 0) {
                const { latitude, longitude } = geocoded[0];

                fetchConcerts(searchCity, selectedDate);

                setLocation({ coords: { latitude, longitude } });
                setMapRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0322,
                    longitudeDelta: 0.0221,
                });
            } else {
                console.log('City not found!');
            }
        } catch (error) {
            console.error('Error searching city:', error);
        }
    };

    const toggleFavorite = (concert) => {
        if (favoriteConcertIds.has(concert.id)) {
            const newSet = new Set(favoriteConcertIds);
            newSet.delete(concert.id);
            setFavoriteConcertIds(newSet);
        } else {
            saveToFavorites(concert);
            const newSet = new Set(favoriteConcertIds);
            newSet.add(concert.id);
            setFavoriteConcertIds(newSet);
        }
    };

    const onDateChange = (event, selected) => {
        setShowDatePicker(false);
        if (event?.type === 'set' && selected) {
            setSelectedDate(selected);
            if (searchCity.trim()) {
                fetchConcerts(searchCity, selected);
            }
        }
    };

    const handleConcertPress = (concert) => {
        const venue = concert._embedded.venues[0];
        const concertLocation = {
            latitude: parseFloat(venue.location.latitude),
            longitude: parseFloat(venue.location.longitude),
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
        };
        setMapRegion(concertLocation);
        navigation.navigate('ConcertDetail', { concert });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/concert.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <Header navigation={navigation} />
                <View style={styles.searchRow}>
                    <TextInput
                        placeholder={i18n.t('searchByCity')}
                        style={styles.input}
                        value={searchCity}
                        onChangeText={setSearchCity}
                        onSubmitEditing={handleCitySearch}
                        returnKeyType="search"
                    />
                    <Pressable onPress={() => setShowDatePicker(true)} style={styles.calendarButton}>
                        <FontAwesome name="calendar" size={18} color="#333" />
                        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                    </Pressable>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                <MapView
                    style={styles.map}
                    region={mapRegion || {
                        latitude: location?.coords.latitude || 60.1699,
                        longitude: location?.coords.longitude || 24.9384,
                        latitudeDelta: 0.0322,
                        longitudeDelta: 0.0221,
                    }}
                >
                    {location && (
                        <Marker
                            coordinate={{
                                latitude: parseFloat(location.coords.latitude),
                                longitude: parseFloat(location.coords.longitude),
                            }}
                        />
                    )}
                    {concerts.map((concert) => (
                        <Marker
                            key={concert.id}
                            coordinate={{
                                latitude: parseFloat(concert._embedded.venues[0].location.latitude),
                                longitude: parseFloat(concert._embedded.venues[0].location.longitude),
                            }}
                            title={concert.name}
                            description={concert._embedded.venues[0].name}
                            onPress={() => handleConcertPress(concert)}
                        />
                    ))}
                </MapView>

                <View style={{ flex: 1 }}>
                    {concerts.length === 0 ? (
                        <Text style={styles.noConcertsText}>{i18n.t('noConcertsFound')}</Text>
                    ) : (
                        <FlatList
                            data={concerts}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => {
                                        const venue = item._embedded.venues[0];
                                        setMapRegion({
                                            latitude: parseFloat(venue.location.latitude),
                                            longitude: parseFloat(venue.location.longitude),
                                            latitudeDelta: 0.0322,
                                            longitudeDelta: 0.0221,
                                        });
                                    }}
                                    style={styles.card}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={styles.title}>{item.name}</Text>
                                        <Pressable onPress={() => toggleFavorite(item)} style={styles.starButton}>
                                            <FontAwesome
                                                name={favoriteConcertIds.has(item.id) ? 'star' : 'star-o'}
                                                size={24}
                                                color="gold"
                                            />
                                        </Pressable>
                                    </View>
                                </Pressable>
                            )}
                            contentContainerStyle={{ paddingBottom: 200 }}
                            style={{ flex: 1 }}
                        />
                    )}
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    input: {
        flex: 1,
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
        flex: 1,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 10,
    },
    calendarButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    noConcertsText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        fontWeight: 'bold',
    },
    starButton: {
        paddingLeft: 10,
    },
});
