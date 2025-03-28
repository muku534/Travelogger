import 'react-native-get-random-values';
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
import { v4 as uuidv4 } from 'uuid';
import FastImage from "react-native-fast-image";


const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const SearchScreen = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const coordinates = route.params.coordinates;
    const type = route.params.type;
    const dayIndex = route.params.dayIndex;

    const [destination, setDestination] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
    const [directions, setDirections] = useState([]);

    const suggestionBoxRef = useRef(new Animated.Value(0)).current;
    const [tripCountryCode, setTripCountryCode] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState([]); // ✅ Store nearby places

    useEffect(() => {
        const fetchCountryCode = async () => {
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json`,
                    {
                        params: {
                            latlng: `${coordinates[0]},${coordinates[1]}`,
                            key: GOOGLE_API_KEY,
                        },
                    }
                );

                if (response.data.status === "OK") {
                    const addressComponents = response.data.results[0].address_components;
                    const countryComponent = addressComponents.find(comp => comp.types.includes("country"));
                    if (countryComponent) {
                        setTripCountryCode(countryComponent.short_name); // "IN" for India, "RU" for Russia
                    }
                }
            } catch (error) {
                logger.error("Error fetching country code:", error);
            }
        };

        fetchCountryCode();
    }, [coordinates]);


    const fetchNearbyPlaces = async () => {
        let placeType;
        if (type === "hotel") {
            placeType = "lodging"; // Google Places category for hotels
        } else if (type === "restaurant") {
            placeType = "restaurant";
        } else {
            placeType = "tourist_attraction"; // Covers general activities & attractions
        }

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
                {
                    params: {
                        location: `${coordinates[0]},${coordinates[1]}`,
                        radius: 5000, // ✅ Show places within 5km radius
                        type: placeType, // ✅ Filter places by type
                        key: GOOGLE_API_KEY,
                    },
                }
            );

            if (response.data.status === "OK") {
                setNearbyPlaces(response.data.results); // ✅ Store nearby places in state
            } else {
                setNearbyPlaces([]); // ✅ No results found
            }
        } catch (error) {
            logger.error("Error fetching nearby places:", error);
            setNearbyPlaces([]);
        }
    };

    useEffect(() => {
        fetchNearbyPlaces();
    }, [coordinates, type]);

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

        let placeType;
        if (type === "hotel") {
            placeType = "lodging"; // Google Places category for hotels
        } else if (type === "restaurant") {
            placeType = "restaurant";
        } else {
            placeType = "tourist_attraction"; // Covers general activities & attractions
        }

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
                {
                    params: {
                        input,
                        key: GOOGLE_API_KEY,
                        language: "en",
                        location: `${coordinates[0]},${coordinates[1]}`,
                        radius: 50000,
                        strictbounds: true,
                        components: tripCountryCode ? `country:${tripCountryCode}` : undefined,
                        types: placeType,
                    },
                }
            );

            if (response.data.status === "OK" && response.data.predictions.length > 0) {
                setSuggestions(response.data.predictions);
                setShowSuggestions(true);
            } else {
                setSuggestions([{ description: `No ${type}s found nearby`, place_id: "not_found" }]); // ✅ Show "No results found"
                setShowSuggestions(true);
            }
        } catch (error) {
            logger.error("Error fetching places:", error);
            setSuggestions([{ description: "Error fetching results", place_id: "error" }]); // ✅ Handle API errors gracefully
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
            console.log("Error fetching place details:", error);
        }
    };

    const getMarkerImage = () => {
        switch (type) {
            case "hotel":
                return Images.hotelMarker;
            case "activity":
                return Images.activityMarker;
            case "restaurant":
                return Images.restaurantMarker;
            default:
                return Images.hotelMarker; // A fallback icon
        }
    };

    const handleAddToList = () => {
        // console.log("naresh sharma: ", selectedPlaceDetails);

        if (selectedPlaceDetails && coordinates.length === 2) {
            const { latitude, longitude } = selectedPlaceDetails.coordinates;
            const itineraryLat = coordinates[0]; // ✅ Extract latitude from array
            const itineraryLng = coordinates[1]; // ✅ Extract longitude from array

            const distance = getDistanceFromLatLonInKm(itineraryLat, itineraryLng, latitude, longitude);

            if (distance > 500) {
                Toast.show({
                    type: "error",
                    text1: "Location Too Far",
                    text2: "You can only add places within 500 km of your itinerary location.",
                });
                return;
            }

            const item = {
                id: uuidv4(),
                type,
                ...selectedPlaceDetails,
                price: selectedPlaceDetails.price || "0.00",
            };

            dispatch({
                type: ADD_TRIP_DAY_ITEM,
                payload: {
                    dayIndex,
                    item,
                },
            });
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
                        {`Add ${type} to Your Itinerary`}
                    </Text>
                </View>

                <View style={{ marginTop: hp(2), marginHorizontal: wp(6) }}>
                    <Text style={styles.label}>
                        {`Find the best ${type} for your trip`}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={`Search for a ${type}...`}
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
                    } : coordinates.length === 2 && {
                        latitude: coordinates[0],  // ✅ Use itinerary latitude
                        longitude: coordinates[1], // ✅ Use itinerary longitude
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                >

                    {selectedLocation && (
                        <Marker coordinate={selectedLocation} title={selectedPlaceDetails?.title}>
                            <Image source={getMarkerImage()} style={styles.customMarker} />
                        </Marker>
                    )}
                </MapView>

                {/* Nearby Places List (Google Maps Style) */}
                <View style={styles.bottomCardContainer}>
                    <FlatList
                        data={nearbyPlaces}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            // Convert place type to a user-friendly name
                            const placeType = item.types.includes("lodging") ? "Hotel" :
                                item.types.includes("restaurant") ? "Restaurant" :
                                    item.types.includes("tourist_attraction") ? "Activity" :
                                        "Other"; // Fallback if type is unknown

                            return (
                                <TouchableOpacity style={styles.card} onPress={() => handlePlaceSelect(item)} activeOpacity={0.7}>
                                    <FastImage
                                        source={{
                                            uri: item.photos?.[0]?.photo_reference
                                                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
                                                : "https://via.placeholder.com/400",
                                            priority: FastImage.priority.high,
                                            cache: FastImage.cacheControl.immutable,  // Enable caching
                                        }}
                                        style={styles.cardImage}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />

                                    <View style={styles.cardDetails}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.cardRating} numberOfLines={1}>
                                            ⭐ {item.rating || "N/A"} ({item.user_ratings_total || 0} reviews)
                                        </Text>
                                        <Text style={styles.cardCategory} numberOfLines={1}>{placeType}</Text>
                                        <Text style={styles.cardStatus}>
                                            {item.opening_hours?.open_now ? "🟢 Open" : "🔴 Closed"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Add into the list"
                        onPress={handleAddToList}
                    />
                </View>

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
        height: hp(45),
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
    bottomCardContainer: {
        position: "absolute",
        bottom: hp(6),
        left: 0,
        right: 0,
        paddingVertical: hp(1),
        borderTopLeftRadius: wp(4),
        borderTopRightRadius: wp(4),
    },
    card: {
        marginBottom: hp(3),
        width: wp(45),
        height: hp(25),
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
        fontSize: hp(2.1),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },
    cardRating: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.Midgray,
    },
    cardCategory: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.Midgray,
        paddingBottom: hp(0.7)
    },
    cardStatus: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray
    },

    /* Fixed Bottom Button */
    buttonContainer: {
        position: "absolute",
        bottom: hp(3), // Position slightly above screen bottom
        width: "100%",
        paddingHorizontal: wp(6),
    },

});
