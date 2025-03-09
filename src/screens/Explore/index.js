import { GOOGLE_API_KEY } from "@env";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, SafeAreaView, StatusBar, Image, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily, Images } from '../../../constants';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import debounce from "lodash/debounce";
import logger from '../../utils/logger';

const Explore = ({ route }) => {
    const navigation = useNavigation();
    const [destination, setDestination] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);

    const suggestionBoxRef = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(suggestionBoxRef, {
            toValue: showSuggestions ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [showSuggestions]);

    const fetchPlaces = async (input) => {
        if (!input.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
                {
                    params: {
                        input,
                        key: GOOGLE_API_KEY,
                        language: "en",
                    },
                }
            );

            if (response.data.status === "OK") {
                setSuggestions(response.data.predictions);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            logger.error("Error fetching places:", error);
            setSuggestions([]);
            setShowSuggestions(true);
        }
    };

    const debouncedFetchPlaces = useCallback(debounce(fetchPlaces, 500), []);

    const handleDestinationChange = (text) => {
        setDestination(text);
        debouncedFetchPlaces(text);
    };

    //  Handle Place Selection
    const handlePlaceSelect = async (place) => {
        setDestination(place.description);
        setSuggestions([]);
        setShowSuggestions(true);

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json`,
                {
                    params: {
                        place_id: place.place_id,
                        key: GOOGLE_API_KEY,
                    },
                }
            );

            if (response.data.status === "OK") {
                const details = response.data.result;
                const { lat, lng } = details.geometry.location;

                setSelectedLocation({ latitude: lat, longitude: lng });
                // Fetch nearby places
                fetchNearbyPlaces(lat, lng);
            }
        } catch (error) {
            logger.error("Error fetching place details:", error);
        }
    };

    const fetchNearbyPlaces = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
                {
                    params: {
                        location: `${latitude},${longitude}`,
                        radius: 5000, // 5km radius
                        type: "restaurant", // Change based on your requirement
                        key: GOOGLE_API_KEY,
                    },
                }
            );

            if (response.data.status === "OK") {
                setNearbyPlaces(response.data.results);
            } else {
                setNearbyPlaces([]);
            }
        } catch (error) {
            logger.error("Error fetching nearby places:", error);
            setNearbyPlaces([]);
        }
    };

    const handleNearbySelect = (place) => {
        setSelectedLocation({
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
        });
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={hp(3)} color={COLORS.darkgray} />
                    </TouchableOpacity>
                    {/* <Text style={styles.header}>Add a {category} to the itinerary</Text> */}
                    <Text style={styles.header}>
                        Explore Places
                    </Text>
                </View>

                <View style={{ marginTop: hp(2), marginHorizontal: wp(6) }}>
                    <Text style={styles.label}>
                        Discover and explore amazing places
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={"Search for places..."}
                        value={destination}
                        onChangeText={handleDestinationChange}
                    />
                    {showSuggestions && (
                        <Animated.View style={[styles.suggestionBox, { opacity: suggestionBoxRef, }]}>
                            <FlatList
                                data={suggestions}
                                keyExtractor={(item) => item.place_id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.suggestionItem} onPress={() => handlePlaceSelect(item)}>
                                        <Text style={styles.suggestionText}>{item.description}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </Animated.View>
                    )}

                </View>

                {/* Map */}
                <MapView
                    style={styles.map}
                    region={selectedLocation ? {
                        latitude: selectedLocation.latitude,
                        longitude: selectedLocation.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    } : {
                        latitude: 37.7749, longitude: -122.4194, latitudeDelta: 0.1, longitudeDelta: 0.1
                    }}
                >
                    {selectedLocation && (
                        <Marker coordinate={selectedLocation} title={selectedPlaceDetails?.title}>
                            <Image source={Images.hotelMarker} style={styles.customMarker} />
                        </Marker>
                    )}
                </MapView>

                {nearbyPlaces.length > 0 && (
                    <View style={styles.bottomCardContainer}>
                        <FlatList
                            horizontal
                            data={nearbyPlaces}
                            keyExtractor={(item) => item.place_id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.card} onPress={() => handleNearbySelect(item)} activeOpacity={0.7}>
                                    <Image
                                        source={{
                                            uri: item.photos?.[0]?.photo_reference
                                                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
                                                : "https://via.placeholder.com/400",
                                        }}
                                        style={styles.cardImage}
                                    />
                                    <View style={styles.cardDetails}>
                                        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                                        <Text style={styles.cardRating}>
                                            ⭐ {item.rating || "N/A"} ({item.user_ratings_total || 0} reviews)
                                        </Text>
                                        <Text style={styles.cardCategory}>{item.types[0].replace("_", " ")}</Text>
                                        <Text style={styles.cardStatus}>
                                            {item.opening_hours?.open_now ? "🟢 Open" : "🔴 Closed"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
};

export default Explore;


const styles = StyleSheet.create({
    container: { flex: 1, marginTop: hp(6.2), backgroundColor: COLORS.white },
    headerContainer: {
        paddingHorizontal: wp(3),
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: wp(2),
    },
    header: {
        fontSize: hp(2.2),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
    },
    label: {
        fontSize: wp(4),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        marginBottom: hp(1),
    },
    input: {
        borderWidth: 0.5,
        color: COLORS.darkgray,
        borderColor: COLORS.Midgray,
        borderRadius: wp(2),
        padding: hp(1.5),
        height: hp(6),
        fontSize: wp(4),
        marginBottom: hp(2),
    },
    suggestionBox: {
        position: "absolute",
        top: hp(9.2),
        left: wp(0),
        right: wp(0),
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        zIndex: 1,
        borderWidth: 0.5,
        borderColor: COLORS.gray,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        // elevation: 5,
        maxHeight: hp(25),
        overflow: "hidden"
    },
    suggestionItem: {
        padding: wp(2),
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1
    },
    suggestionText: {
        fontSize: hp(2),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold
    },
    map: {
        width: '100%',
        height: hp(100),
        borderRadius: wp(2),
        marginBottom: hp(2),
    },
    customMarker: {
        width: wp(8),
        height: wp(8),
        resizeMode: "contain",
    },
    bottomCardContainer: {
        position: "absolute",
        bottom: hp(0),
        left: 0,
        right: 0,
        paddingVertical: hp(1),
        // backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderTopLeftRadius: wp(4),
        borderTopRightRadius: wp(4),
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: -2 },
        elevation: 5,
    },
    card: {
        marginBottom: hp(3),
        width: wp(45),
        height: hp(28),
        marginHorizontal: wp(2),
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    cardImage: {
        width: "100%",
        height: hp(12),
        resizeMode: "cover",
    },
    cardDetails: {
        padding: wp(2),
    },
    cardTitle: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },
    cardRating: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.Midgray,
    },
    cardCategory: {
        fontSize: hp(1.6),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.Midgray
    },
    cardStatus: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray
    },

});

