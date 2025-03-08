import { GOOGLE_API_KEY } from "@env";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, SafeAreaView, StatusBar, Image, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily, Images } from '../../../constants';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from '../../components/Button';
import axios from "axios";
import debounce from "lodash/debounce";
import { useDispatch } from "react-redux";
import { ADD_TRIP_DAY_ITEM } from "../../redux/Actions";
import logger from '../../utils/logger';
import Toast from "react-native-toast-message";

const SearchScreen = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    // const { category, dayIndex } = route.params;
    const isSearchOnly = route.params?.isSearchOnly || false;

    const category = route.params?.category || "Hotel";
    const dayIndex = route.params?.dayIndex ?? 0;

    const [destination, setDestination] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
    const [directions, setDirections] = useState([]);

    const suggestionBoxRef = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(suggestionBoxRef, {
            toValue: showSuggestions ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [showSuggestions]);

    //  Fetch Place Suggestions from Google Places API 

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

    //  Optimize API Calls with Debounce 

    const debouncedFetchPlaces = useCallback(debounce(fetchPlaces, 500), []);

    //  Handle Destination Input Change 

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
                const placeDetails = {
                    name: details.name,
                    coordinates: { latitude: lat, longitude: lng },
                    address: details.formatted_address, // ✅ Store Address
                    rating: details.rating || "N/A", // ✅ Store Ratings
                    website: details.website || "N/A", // ✅ Store Website
                    image: details.photos?.[0]?.photo_reference
                        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
                        : "https://via.placeholder.com/400",
                };

                setSelectedLocation({ latitude: lat, longitude: lng });
                setSelectedPlaceDetails(placeDetails);
            }
        } catch (error) {
            logger.error("Error fetching place details:", error);
        }
    };

    const getMarkerImage = () => {
        switch (category) {
            case "Hotel":
                return Images.hotelMarker;
            case "Activity":
                return Images.activityMarker;
            case "Restaurant":
                return Images.restaurantMarker;
            default:
                return Images.hotelMarker; // A fallback icon
        }
    };

    const handleAddToList = () => {
        if (selectedPlaceDetails) {
            const item = {
                category,
                ...selectedPlaceDetails,
                price: selectedPlaceDetails.price || "0.00", // ✅ Default to "$0.00" if missing
            };

            dispatch({
                type: ADD_TRIP_DAY_ITEM,
                payload: {
                    dayIndex,
                    item,
                },
            })
            navigation.goBack();
        } else {
            Toast.show({
                type: "error",
                text1: "Missing Selection",
                text2: "Please select a place to add.",
            });
        }
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
                        {isSearchOnly ? "Explore Places" : `Add ${category} to Your Itinerary`}
                    </Text>
                </View>

                <View style={{ marginTop: hp(2), marginHorizontal: wp(6) }}>
                    <Text style={styles.label}>
                        {isSearchOnly ? "Discover and explore amazing places" : `Find the best ${category} for your trip`}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={isSearchOnly ? "Search for places..." : `Search for a ${category}...`}
                        value={destination}
                        onChangeText={handleDestinationChange}
                    />
                    {showSuggestions && (
                        <Animated.View style={[styles.suggestionBox, { opacity: suggestionBoxRef }]}>
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
                            <Image source={getMarkerImage()} style={styles.customMarker} />
                        </Marker>
                    )}
                </MapView>

                {/* <FlatList
                    data={results}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
                            <Text style={styles.resultText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                /> */}

                {!isSearchOnly && (
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Add into the list"
                            onPress={handleAddToList}
                        />
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
};

export default SearchScreen;


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
        borderWidth: 1,
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
        top: hp(10),
        left: wp(0),
        right: wp(0),
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        zIndex: 1,
        borderWidth: 0.7,
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
    resultItem: {
        padding: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.red,
    },
    resultText: { fontSize: hp(2.2) },
    /* Fixed Bottom Button */
    buttonContainer: {
        position: "absolute",
        bottom: hp(4), // Position slightly above screen bottom
        width: "100%",
        paddingHorizontal: wp(6),
    },

});

