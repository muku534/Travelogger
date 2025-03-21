import React, { useEffect, useRef, useState, version } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Animated, Image, ScrollView, Linking, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, TextInput, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS, fontFamily, Images, SVGS } from '../../../constants';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import Toast from "react-native-toast-message";
import { createItineraries, ShareItinerary, updateItineraryById } from '../../services/planTripService';
import LinearGradient from 'react-native-linear-gradient';
import logger from '../../utils/logger';
import RBSheet from 'react-native-raw-bottom-sheet';
import { CLEAR_TRIP_DETAILS, DELETE_TRIP_DAY_ITEM } from '../../redux/Actions';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const AiPlanTripDetails = ({ navigation }) => {
    const refRBSheet = useRef(null); // Bottom Sheet Ref
    const dispatch = useDispatch();
    const { itineraryId, destination, startDate, endDate, tripImg, coordinates, tripDays } = useSelector(state => state.tripDetails);
    const [expanded, setExpanded] = useState(null);
    const [activeTab, setActiveTab] = useState('List');
    const sliderAnim = useRef(new Animated.Value(wp(12))).current; // Start at 'List' position
    const userData = useSelector(state => state.userData);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false)
    const [distances, setDistances] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const calculateTotalBudget = () => {
        if (!tripDays || tripDays.length === 0) return 0;

        return tripDays.reduce((totalBudget, day) => {
            let dayBudget = 0;

            // Extract all items (hotels, activities, restaurants)
            const allItems = [
                ...(day.items || []),
                ...(day.sections?.hotels || []),
                ...(day.sections?.activities || []),
                ...(day.sections?.restaurants || [])
            ];

            // Sum up all item prices
            allItems.forEach(item => {
                const price = item.price ? parseFloat(item.price.toString().replace('$', '')) : 0;
                dayBudget += price;
            });

            return totalBudget + dayBudget;
        }, 0).toFixed(2); // ✅ Convert to 2 decimal places
    };

    const totalBudget = calculateTotalBudget(); // ✅ Get the final total

    const handleShareItinerary = async () => {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError("Email is required");
            setTimeout(() => setEmailError(""), 800);
            return;
        }
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            setTimeout(() => setEmailError(""), 800);
            return;
        }

        setEmailError(""); // Clear previous errors
        setLoading(true);  // Show loading indicator

        // Function to format dates
        const formatDate = (dateString) => {
            if (!dateString) return "Unknown Date"; // Prevent errors from undefined dates
            const dateObj = new Date(dateString);
            return dateObj.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
        };

        // Ensure tripDays is valid
        if (!tripDays || tripDays.length === 0) {
            setLoading(false);
            logger.error("Error: No itinerary data found.");
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No itinerary data available to share.",
            });
            return;
        }

        // Format itinerary data for API
        // Format itinerary data for API
        const itineraryData = {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            destination: destination,
            recipientEmail: email,
            dayPlans: tripDays
                .map((day) => {
                    // Check if day.items exists, otherwise merge all categories from day.sections
                    const locations = day.items
                        ? day.items // Use day.items if available
                        : Object.values(day.sections || {}) // Merge all sections into a single array
                            .flat()
                            .filter(item => item.title || item.name || item.location?.name || item.address);

                    return {
                        date: formatDate(day.day),
                        locations: locations.map((item) => ({
                            name: item.title || item.name || item.location?.name || item.address || "Unknown Location",
                            category: item.type || "activity",
                            address: item.location?.address || item.description || item.address || "No Address",
                        })),
                    };
                })
                .filter((day) => day.locations.length > 0), // Keep only days with locations
        };

        try {
            const response = await ShareItinerary(itineraryData);

            // Show success toast
            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Itinerary shared successfully!",
            });

            toggelModel(); // Close modal after success
            setEmail(""); // Reset email input
        } catch (error) {
            logger.error("API Error:", error.response || error);

            // Show error toast
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "Failed to send itinerary.",
            });
        } finally {
            logger.log("Resetting loading state...");
            setLoading(false); // Ensure loading is hidden
        }
    };


    // Modal Toggle Function
    const toggelModel = () => {
        setModalVisible((prevVisible) => !prevVisible);
        setEmailError(""); // Clear error when closing modal
    };

    const handleToggle = (tab) => {
        setActiveTab(tab);
        Animated.timing(sliderAnim, {
            toValue: tab === 'List' ? wp(12) : 0, // Adjust for button width
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    // Function to calculate Haversine Distance
    const haversineDistance = (coords1, coords2) => {
        const toRad = (angle) => (Math.PI / 180) * angle;
        const R = 3958.8; // Radius of Earth in km

        const lat1 = toRad(coords1?.latitude);
        const lon1 = toRad(coords1?.longitude);
        const lat2 = toRad(coords2?.latitude);
        const lon2 = toRad(coords2?.longitude);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (R * c).toFixed(2); // Returns distance in km
    };

    // Estimate Duration Based on Distance
    const estimateDuration = (distance, category) => {
        let speedMph = 50; // Default: Car travel

        if (category.toLowerCase() === "walking") speedMph = 3;
        if (category.toLowerCase() === "biking") speedMph = 12;

        const durationHours = distance / speedMph;
        const durationMinutes = Math.round(durationHours * 60);

        return durationMinutes > 60
            ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
            : `${durationMinutes} min`;
    };


    // Extract coordinates from different structures
    const getCoordinates = (place) => {
        if (!place) return null;

        // ✅ Case 1: Coordinates in an array format
        if (Array.isArray(place.coordinates) && place.coordinates.length === 2) {
            return { latitude: place.coordinates[0], longitude: place.coordinates[1] };
        }

        // ✅ Case 2: Coordinates in an object format
        if (place.coordinates && typeof place.coordinates === "object") {
            return { latitude: place.coordinates.latitude, longitude: place.coordinates.longitude };
        }

        // ✅ Case 3: Coordinates inside a nested `location` object
        if (place.location?.coordinates && Array.isArray(place.location.coordinates)) {
            return { latitude: place.location.coordinates[0], longitude: place.location.coordinates[1] };
        }

        return null;
    };


    useEffect(() => {
        calculateDistances();
    }, [tripDays]);

    // Function to calculate distances locally
    const calculateDistances = () => {
        let newDistances = {};

        for (let i = 0; i < tripDays.length; i++) {
            let places = [];

            // ✅ Handle both `items` and `sections` structures
            if (tripDays[i]?.items && Array.isArray(tripDays[i].items)) {
                places = tripDays[i].items; // ✅ Use `items` if available (saved itineraries)
            } else if (tripDays[i]?.sections) {
                places = [
                    ...(tripDays[i].sections.hotels || []),
                    ...(tripDays[i].sections.activities || []),
                    ...(tripDays[i].sections.restaurants || [])
                ];
            }

            if (!places || places.length < 2) continue;
            for (let j = 0; j < places.length - 1; j++) {
                let origin = getCoordinates(places[j]);
                let destination = getCoordinates(places[j + 1]);
                let category = places[j]?.type || places[j]?.category || "Car"; // Default to car travel

                const originName = places[j]?.name || places[j]?.title || "Unnamed Place";
                const destinationName = places[j + 1]?.name || places[j + 1]?.title || "Unnamed Place";

                if (!origin || !destination || !origin.latitude || !origin.longitude || !destination.latitude || !destination.longitude) {
                    logger.info(`Missing coordinates for ${originName} or ${destinationName}`);
                    continue;
                }

                const distanceMiles = haversineDistance(origin, destination);
                const durationText = estimateDuration(distanceMiles, category);

                newDistances[`${originName}-${destinationName}`] = {
                    distance: `${distanceMiles} miles`,
                    duration: durationText,
                };
            }
        }

        setDistances(newDistances);
    };

    const handleAddItem = (type, dayIndex) => {
        let fallbackCoordinates = coordinates; // Default to main coordinates

        // If main coordinates are not available, use the first trip day's first item's coordinates
        if (!coordinates?.length && tripDays?.length > 0 && tripDays[0].items?.length > 0) {
            fallbackCoordinates = tripDays[0].items[0]?.location?.coordinates;
        }

        navigation.navigate("SearchScreen", { type, dayIndex, isSearchOnly: false, coordinates: fallbackCoordinates });
    };

    const formatDisplayDate = (inputDate) => {
        const date = new Date(inputDate);

        // Format the date as "Mon Mar 22 2025"
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);

        // Extract year, month, and day in the local time zone
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
    };

    const handleSaveItinerary = async () => {
        try {
            setSaveLoading(true);
            if (itineraryId) {
                const itineraryData = {
                    itinerary: {
                        userId: userData.userId,
                        title: `${destination} Trip ${new Date().getFullYear()}`,
                        status: "draft",
                        visibility: "private",
                        generatedBy: "AI",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        tripImg: tripImg,
                        tripDetails: {
                            destination: { name: destination, coordinates: coordinates },
                            startDate: startDate,
                            endDate: endDate,
                            budget: {
                                currency: "USD",
                                total: 0,
                                breakdown: { accommodation: 0, activities: 0, dining: 0, transport: 0 },
                            },
                        },
                        days: tripDays.map((day, index) => ({
                            date: formatDate(day.date || day.day), // Convert date to YYYY-MM-DD
                            dayNumber: index + 1, // Ensure day_number is sequential
                            budget: { planned: 0, actual: 0 }, // Required budget field
                            sections: {
                                hotels: day.items
                                    .filter(item => item.type === "hotel")
                                    .map(hotel => ({
                                        type: "hotel",
                                        title: hotel.name || hotel.title || "",
                                        description: hotel.description || "",
                                        location: {
                                            name: hotel.location?.name || hotel.name || "",
                                            address: hotel.location?.address || hotel.address || "",
                                            coordinates: hotel.location?.coordinates
                                                ? [hotel.location.coordinates[0], hotel.location.coordinates[1]]
                                                : hotel.coordinates
                                                    ? [hotel.coordinates.latitude, hotel.coordinates.longitude]
                                                    : [],
                                            placeId: hotel.location?.placeId || hotel.placeId || null
                                        },
                                        startTime: hotel.startTime || null,
                                        endTime: hotel.endTime || null,
                                        duration: hotel.duration || null,
                                        price: hotel.price || 0,
                                        priceLevel: hotel.priceLevel || 1,
                                        rating: hotel.rating && hotel.rating !== "N/A" ? hotel.rating : 0,
                                        userRatingsTotal: hotel.userRatingsTotal || 0,
                                        photos: hotel.photos && Array.isArray(hotel.photos)
                                            ? hotel.photos.map(photo => ({ url: photo.url || null }))
                                            : hotel.image ? [{ url: hotel.image }] : [],
                                        contact: {
                                            phone: hotel.contact?.phone || hotel.phone || "",
                                            email: hotel.contact?.email || "",
                                            website: hotel.contact?.website === "N/A" ? "" : hotel.contact?.website || hotel.website === "N/A" ? "" : hotel.website || "",
                                            googleMapsUrl: hotel.contact?.googleMapsUrl || hotel.googleMapsUrl || "",
                                        },
                                        operatingHours: {
                                            isOpen: hotel.operatingHours?.isOpen || hotel.isOpen || false,
                                            periods: hotel.operatingHours?.periods
                                                ? Object.values(hotel.operatingHours.periods.reduce((acc, period) => {
                                                    acc[period.day] = period; // Keep only the last entry per day
                                                    return acc;
                                                }, {}))
                                                : (hotel.openDay && hotel.openTime ? [{ day: hotel.openDay, hours: hotel.openTime }] : [])
                                        },
                                        bookingInfo: hotel.bookingInfo || null,
                                        metadata: {
                                            tags: hotel.tags || [],
                                            isTemplate: hotel.isTemplate || false,
                                            language: hotel.language || "en",
                                            version: hotel.version || 1,
                                        }
                                    })),

                                activities: day.items
                                    .filter(item => item.type === "activity")
                                    .map(activity => ({
                                        type: "activity",
                                        title: activity.name || activity.title || "Unnamed Activity",
                                        description: activity.description || "",
                                        location: {
                                            name: activity.location?.name || activity.name || "",
                                            address: activity.location?.address || activity.address || "",
                                            coordinates: activity.location?.coordinates
                                                ? [activity.location.coordinates[0], activity.location.coordinates[1]]
                                                : activity.coordinates
                                                    ? [activity.coordinates.latitude, activity.coordinates.longitude]
                                                    : [],
                                            placeId: activity.location?.placeId || activity.placeId || null
                                        },
                                        startTime: activity.startTime || null,
                                        endTime: activity.endTime || null,
                                        duration: activity.duration || null,
                                        price: activity.price || 0,
                                        priceLevel: activity.priceLevel || 1,
                                        rating: activity.rating && activity.rating !== "N/A" ? activity.rating : 0,
                                        userRatingsTotal: activity.userRatingsTotal || 0,
                                        photos: activity.photos && Array.isArray(activity.photos)
                                            ? activity.photos.map(photo => ({ url: photo.url || null }))
                                            : activity.image ? [{ url: activity.image }] : [],
                                        contact: {
                                            phone: activity.contact?.phone || activity.phone || "",
                                            email: activity.contact?.email || activity.email || "",
                                            website: activity.contact?.website === "N/A" ? "" : activity.contact?.website ||
                                                activity.website === "N/A" ? "" : activity.website || "",
                                            googleMapsUrl: activity.contact?.googleMapsUrl || activity.googleMapsUrl || "",
                                        },
                                        operatingHours: {
                                            isOpen: activity.operatingHours?.isOpen || activity.isOpen || false,
                                            periods: activity.operatingHours?.periods
                                                ? Object.values(activity.operatingHours.periods.reduce((acc, period) => {
                                                    acc[period.day] = period; // Keep only the last entry per day
                                                    return acc;
                                                }, {}))
                                                : (activity.openDay && activity.openTime ? [{ day: activity.openDay, hours: activity.openTime }] : [])
                                        },
                                        metadata: {
                                            tags: activity.tags || [],
                                            isTemplate: activity.isTemplate || false,
                                            language: activity.language || "en",
                                            version: activity.version || 1,
                                        }
                                    })),

                                restaurants: day.items
                                    .filter(item => item.type === "restaurant")
                                    .map(restaurant => ({
                                        type: "restaurant",
                                        title: restaurant.title || restaurant.name || "",
                                        description: restaurant.description || restaurant.address || "",
                                        location: {
                                            name: restaurant.location?.name || restaurant.name || "",
                                            address: restaurant.location?.address || restaurant.address || "",
                                            coordinates: restaurant.location?.coordinates
                                                ? [restaurant.location.coordinates[0], restaurant.location.coordinates[1]]
                                                : restaurant.coordinates
                                                    ? [restaurant.coordinates.latitude, restaurant.coordinates.longitude]
                                                    : [],
                                            placeId: restaurant.location?.placeId || restaurant.placeId || null
                                        },
                                        startTime: restaurant.startTime || null,
                                        endTime: restaurant.endTime || null,
                                        duration: restaurant.duration || null,
                                        price: restaurant.price || 0,
                                        priceLevel: restaurant.priceLevel || 1,
                                        rating: restaurant.rating && restaurant.rating !== "N/A" ? restaurant.rating : 0,
                                        userRatingsTotal: restaurant.userRatingsTotal || 0,
                                        photos: restaurant.photos && Array.isArray(restaurant.photos)
                                            ? restaurant.photos.map(photo => ({ url: photo.url || null }))
                                            : restaurant.image ? [{ url: restaurant.image }] : [],
                                        contact: {
                                            phone: restaurant?.contact?.phone || restaurant.phone || "",
                                            email: restaurant?.contact?.email || restaurant.email || "",
                                            website: restaurant?.contact?.website === "N/A" ? "" : restaurant?.contact?.website ||
                                                restaurant.website === "N/A" ? "" : restaurant.website || "",
                                            googleMapsUrl: restaurant?.contact?.googleMapsUrl || restaurant.googleMapsUrl || "",
                                        },
                                        operatingHours: {
                                            isOpen: restaurant.isOpen || false,
                                            periods: restaurant.operatingHours?.periods
                                                ? Object.values(restaurant.operatingHours.periods.reduce((acc, period) => {
                                                    acc[period.day] = period; // Keep only the last entry per day
                                                    return acc;
                                                }, {}))
                                                : (restaurant.openDay && restaurant.openTime ? [{ day: restaurant.openDay, hours: restaurant.openTime }] : [])
                                        },
                                        metadata: {
                                            tags: restaurant.tags || [],
                                            isTemplate: restaurant.isTemplate || false,
                                            language: restaurant.language || "en",
                                            version: restaurant.version || 1,
                                        },
                                        cuisine: restaurant.cuisine || [],
                                    })),
                            }
                        }))
                    },
                };
                // Format JSON with indentation for easy copy-paste
                const formattedItinerary = JSON.stringify(itineraryData, null, 4);

                itineraryData.itinerary.updatedAt = new Date().toISOString();
                const response = await updateItineraryById(itineraryId, itineraryData);
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Itinerary updated successfully!",
                });

            } else {
                const itineraryData = {
                    itinerary: {
                        userId: userData.userId,
                        title: `${destination} Trip ${new Date().getFullYear()}`,
                        status: "draft",
                        visibility: "private",
                        generatedBy: "AI",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        tripImg: tripImg,
                        tripDetails: {
                            destination: { name: destination, coordinates: coordinates },
                            startDate: startDate,
                            endDate: endDate,
                            budget: {
                                currency: "USD",
                                total: 0,
                                breakdown: { accommodation: 0, activities: 0, dining: 0, transport: 0 },
                            },
                        },
                        days: tripDays.map((day, index) => ({
                            date: formatDate(day.date || day.day), // Support both formats
                            dayNumber: index + 1,
                            budget: { planned: 0, actual: 0 },

                            sections: {
                                hotels: (day.sections?.hotels || day.items?.filter(item => item.category === "Hotel")).map(hotel => ({
                                    id: hotel.id || null,
                                    type: "hotel",
                                    title: hotel.name || hotel.title || "Unnamed Hotel",
                                    description: hotel.description || "",
                                    location: {
                                        name: hotel.location?.name || hotel.name || "",
                                        address: hotel.location?.address || hotel.address || "",
                                        coordinates: hotel.location?.coordinates
                                            ? [hotel.location.coordinates[0], hotel.location.coordinates[1]]
                                            : hotel.coordinates
                                                ? [hotel.coordinates.latitude, hotel.coordinates.longitude]
                                                : [],
                                        placeId: hotel.location?.placeId || hotel.placeId || null
                                    },
                                    startTime: hotel.startTime || null,
                                    endTime: hotel.endTime || null,
                                    duration: hotel.duration || null,
                                    price: hotel.price || 0,
                                    priceLevel: hotel.priceLevel || 1,
                                    rating: hotel.rating && hotel.rating !== "N/A" ? hotel.rating : 0,
                                    userRatingsTotal: hotel.userRatingsTotal || 0,
                                    photos: hotel.photos && Array.isArray(hotel.photos)
                                        ? hotel.photos.map(photo => ({ url: photo.url || null }))
                                        : hotel.image ? [{ url: hotel.image }] : [],
                                    contact: {
                                        phone: hotel.contact?.phone || hotel.phone || "",
                                        email: hotel.contact?.email || "",
                                        website: hotel.contact?.website === "N/A" ? "" : hotel.contact?.website || hotel.website === "N/A" ? "" : hotel.website || "",
                                        googleMapsUrl: hotel.contact?.googleMapsUrl || hotel.googleMapsUrl || "",
                                    },
                                    operatingHours: {
                                        isOpen: hotel.operatingHours?.isOpen || hotel.isOpen || false,
                                        periods: hotel.operatingHours?.periods
                                            ? Object.values(hotel.operatingHours.periods.reduce((acc, period) => {
                                                acc[period.day] = period; // Keep only the last entry per day
                                                return acc;
                                            }, {}))
                                            : (hotel.openDay && hotel.openTime ? [{ day: hotel.openDay, hours: hotel.openTime }] : [])
                                    },
                                    bookingInfo: hotel.bookingInfo || null,
                                    metadata: {
                                        tags: hotel.tags || [],
                                        isTemplate: hotel.isTemplate || false,
                                        language: hotel.language || "en",
                                        version: hotel.version || 1,
                                    }
                                })),

                                activities: (day.sections?.activities || day.items?.filter(item => item.category === "Activity")).map(activity => ({
                                    type: "activity",
                                    title: activity.name || activity.title || "Unnamed Activity",
                                    description: activity.description || "",
                                    location: {
                                        name: activity.location?.name || activity.name || "",
                                        address: activity.location?.address || activity.address || "",
                                        coordinates: activity.location?.coordinates
                                            ? [activity.location.coordinates[0], activity.location.coordinates[1]]
                                            : activity.coordinates
                                                ? [activity.coordinates.latitude, activity.coordinates.longitude]
                                                : [],
                                        placeId: activity.location?.placeId || activity.placeId || null
                                    },
                                    startTime: activity.startTime || null,
                                    endTime: activity.endTime || null,
                                    duration: activity.duration || null,
                                    price: activity.price || 0,
                                    priceLevel: activity.priceLevel || 1,
                                    rating: activity.rating && activity.rating !== "N/A" ? activity.rating : 0,
                                    userRatingsTotal: activity.userRatingsTotal || 0,
                                    photos: activity.photos && Array.isArray(activity.photos)
                                        ? activity.photos.map(photo => ({ url: photo.url || null }))
                                        : activity.image ? [{ url: activity.image }] : [],
                                    contact: {
                                        phone: activity.contact?.phone || activity.phone || "",
                                        email: activity.contact?.email || activity.email || "",
                                        website: activity.contact?.website === "N/A" ? "" : activity.contact?.website ||
                                            activity.website === "N/A" ? "" : activity.website || "",
                                        googleMapsUrl: activity.contact?.googleMapsUrl || activity.googleMapsUrl || "",
                                    },
                                    operatingHours: {
                                        isOpen: activity.operatingHours?.isOpen || activity.isOpen || false,
                                        periods: activity.operatingHours?.periods
                                            ? Object.values(activity.operatingHours.periods.reduce((acc, period) => {
                                                acc[period.day] = period; // Keep only the last entry per day
                                                return acc;
                                            }, {}))
                                            : (activity.openDay && activity.openTime ? [{ day: activity.openDay, hours: activity.openTime }] : [])
                                    },
                                    metadata: {
                                        tags: activity.tags || [],
                                        isTemplate: activity.isTemplate || false,
                                        language: activity.language || "en",
                                        version: activity.version || 1,
                                    }
                                })),

                                restaurants: (day.sections?.restaurants || day.items?.filter(item => item.category === "Restaurant")).map(restaurant => ({
                                    type: "restaurant",
                                    title: restaurant.title || restaurant.name || "",
                                    description: restaurant.description || restaurant.address || "",
                                    location: {
                                        name: restaurant.location?.name || restaurant.name || "",
                                        address: restaurant.location?.address || restaurant.address || "",
                                        coordinates: restaurant.location?.coordinates
                                            ? [restaurant.location.coordinates[0], restaurant.location.coordinates[1]]
                                            : restaurant.coordinates
                                                ? [restaurant.coordinates.latitude, restaurant.coordinates.longitude]
                                                : [],
                                        placeId: restaurant.location?.placeId || restaurant.placeId || null
                                    },
                                    startTime: restaurant.startTime || null,
                                    endTime: restaurant.endTime || null,
                                    duration: restaurant.duration || null,
                                    price: restaurant.price || 0,
                                    priceLevel: restaurant.priceLevel || 1,
                                    rating: restaurant.rating && restaurant.rating !== "N/A" ? restaurant.rating : 0,
                                    userRatingsTotal: restaurant.userRatingsTotal || 0,
                                    photos: restaurant.photos && Array.isArray(restaurant.photos)
                                        ? restaurant.photos.map(photo => ({ url: photo.url || null }))
                                        : restaurant.image ? [{ url: restaurant.image }] : [],
                                    contact: {
                                        phone: restaurant?.contact?.phone || restaurant.phone || "",
                                        email: restaurant?.contact?.email || restaurant.email || "",
                                        website: restaurant?.contact?.website === "N/A" ? "" : restaurant?.contact?.website ||
                                            restaurant.website === "N/A" ? "" : restaurant.website || "",
                                        googleMapsUrl: restaurant?.contact?.googleMapsUrl || restaurant.googleMapsUrl || "",
                                    },
                                    operatingHours: {
                                        isOpen: restaurant.isOpen || false,
                                        periods: restaurant.operatingHours?.periods
                                            ? Object.values(restaurant.operatingHours.periods.reduce((acc, period) => {
                                                acc[period.day] = period; // Keep only the last entry per day
                                                return acc;
                                            }, {}))
                                            : (restaurant.openDay && restaurant.openTime ? [{ day: restaurant.openDay, hours: restaurant.openTime }] : [])
                                    },
                                    metadata: {
                                        tags: restaurant.tags || [],
                                        isTemplate: restaurant.isTemplate || false,
                                        language: restaurant.language || "en",
                                        version: restaurant.version || 1,
                                    },
                                    cuisine: restaurant.cuisine || [],
                                })),
                            }
                        })),
                    },
                };
                // Format JSON with indentation for easy copy-paste
                const formattedItinerary = JSON.stringify(itineraryData, null, 4);

                const response = await createItineraries(itineraryData);
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Itinerary saved successfully!",
                });
            }

            navigation.navigate("TabStack");
        } catch (error) {
            logger.error("Error saving itinerary:", error);

            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to save itinerary. Try again later.",
            });
        } finally {
            setSaveLoading(false);
        }
    };

    const handleItemPress = (item, dayIndex) => {
        setSelectedItem({ ...item, dayIndex }); // Store item and its day index
        refRBSheet.current.open();  // Open the bottom sheet
    };

    const handlePlaceAction = (place, actionType) => {
        try {
            if (!place || !place.location || !Array.isArray(place.location.coordinates)) {
                logger.warn("Location data is missing. Redirecting to Google Maps.");
                Linking.openURL("https://www.google.com/maps");
                return;
            }

            const { coordinates } = place.location;
            const [latitude, longitude] = coordinates;

            if (!latitude || !longitude) {
                logger.warn("Invalid coordinates. Redirecting to Google Maps.");
                Linking.openURL("https://www.google.com/maps");
                return;
            }

            switch (actionType) {
                case "viewPlace":
                    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
                    break;

                case "directions":
                    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
                    break;

                case "website":
                    let websiteUrl = place.contact?.website?.trim();

                    if (!websiteUrl || websiteUrl === "N/A") {
                        logger.warn("Website URL is missing or 'N/A'. Redirecting to Google homepage.");
                        Linking.openURL("https://www.google.com");
                        return;
                    }

                    // Ensure the URL starts with http:// or https://
                    if (!/^https?:\/\//i.test(websiteUrl)) {
                        websiteUrl = `https://${websiteUrl}`;
                    }

                    Linking.openURL(websiteUrl);
                    break;

                default:
                    logger.warn("Unknown action type.");
                    break;
            }
        } catch (error) {
            logger.error("Error opening URL:", error);
        }
    };


    const handleDeleteItem = () => {
        if (!selectedItem || selectedItem.dayIndex === undefined) {
            logger.error("No valid item selected for deletion.");
            return;
        }

        dispatch({
            type: DELETE_TRIP_DAY_ITEM,
            payload: {
                dayIndex: selectedItem.dayIndex, // Identify the correct day
                itemId: selectedItem.id,        // Identify the correct item
            },
        });

        // Close the bottom sheet
        refRBSheet.current.close();

        // Show a success toast message
        Toast.show({
            type: "success",
            text1: "Deleted",
            text2: "Item removed from itinerary",
        });
    };

    const getMarkerImage = (type) => {
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

    // Function to handle back navigation and clear Redux
    const handleGoBack = () => {
        dispatch({ type: CLEAR_TRIP_DETAILS }); // ✅ Clears tripDetails Redux state
        navigation.goBack();
    };

    // Handle Android device back button
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                handleGoBack();
                return true; // Prevents default behavior
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => backHandler.remove(); // ✅ Correct way to remove listener
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent backgroundColor="transparent" barStyle={activeTab === 'List' ? 'light-content' : 'dark-content'} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(2) }} >
                <View style={styles.container}>
                    {activeTab === 'List' ? (
                        <ImageBackground source={{ uri: tripImg }} style={styles.headerImage}>
                            <View style={styles.overlay} />
                        </ImageBackground>
                    ) : (
                        <MapView
                            provider="google"
                            style={{ width: wp(100), height: hp(30) }}
                            initialRegion={{
                                latitude: coordinates?.[0] ?? tripDays?.[0]?.items?.[0]?.location?.coordinates?.[0] ?? 22.3193,
                                longitude: coordinates?.[1] ?? tripDays?.[0]?.items?.[0]?.location?.coordinates?.[1] ?? 114.1694,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1,
                            }}
                            onMapReady={() => logger.info("Map Loaded")}
                            onError={(error) => logger.error("Map Error: ", error)}
                        >

                            {/* ✅ Marker for main trip destination (if available) */}
                            {coordinates?.length === 2 && (
                                <Marker
                                    coordinate={{
                                        latitude: coordinates[0],
                                        longitude: coordinates[1],
                                    }}
                                    title="Trip Destination"
                                    description="This is the main trip location."
                                />
                            )}

                            {/* ✅ Display all itinerary items on the map */}
                            {tripDays?.map((day, dayIndex) => {
                                const places = [
                                    ...(day.items || []),
                                    ...(day.sections?.hotels || []),
                                    ...(day.sections?.activities || []),
                                    ...(day.sections?.restaurants || []),
                                ];

                                return places.map((place, index) => {
                                    if (!place.location?.coordinates) return null;

                                    return (
                                        <Marker
                                            key={`${dayIndex}-${index}`}
                                            coordinate={{
                                                latitude: place.location.coordinates[0],
                                                longitude: place.location.coordinates[1],
                                            }}
                                            title={place.title || place.name}
                                            description={place.description || "No description available"}
                                        >
                                            {/* ✅ Custom PNG Marker based on type */}
                                            <Image source={getMarkerImage(place.type)} style={styles.customMarker} />
                                        </Marker>
                                    );
                                });
                            })}

                        </MapView>
                    )}

                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={hp(3)}
                            color={activeTab === 'List' ? COLORS.white : COLORS.darkgray}
                        />
                    </TouchableOpacity>

                    {/* Toggle Switch */}
                    <View style={styles.toggleContainer}>
                        <Animated.View style={[styles.slider, { transform: [{ translateX: sliderAnim }] }]}>
                            <LinearGradient
                                colors={[COLORS.RoyalBlueViolet, COLORS.DeepTeal]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={[StyleSheet.absoluteFill, { borderRadius: wp(2) }]}
                            />
                        </Animated.View>

                        <TouchableOpacity onPress={() => handleToggle('Map')} style={styles.toggleButton} activeOpacity={0.8}>
                            <View style={styles.fullButton}>
                                <Text style={[styles.toggleText, activeTab === 'Map' ? styles.activeText : {}]}>Map</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleToggle('List')} style={styles.toggleButton} activeOpacity={0.8}>
                            <View style={styles.fullButton}>
                                <Text style={[styles.toggleText, activeTab === 'List' ? styles.activeText : {}]}>List</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tripInfo}>
                        <Text style={styles.title}>{destination}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SVGS.CALENDAR width={wp(4)} height={hp(2)} />
                            <Text style={styles.date}>  {startDate} - {endDate}</Text>
                        </View>
                        <Text style={styles.description}>Plan your Trip day by day. Add Hotels, Restaurants, and Activities to create a Perfect Itinerary</Text>
                        <View style={styles.budgetContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <SVGS.AIBUDGET width={wp(5)} height={hp(4)} />
                                <View style={{ paddingHorizontal: wp(1) }}>
                                    <Text style={styles.budgetText}>Total Budget</Text>
                                    <Text style={styles.budgetAmount}>${totalBudget}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(3), marginLeft: 'auto' }}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveItinerary} activeOpacity={0.5} disabled={saveLoading}>
                                    <SVGS.SAVE width={wp(5)} height={hp(2)} />
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.5} style={{ height: hp(3.5), width: wp(9), borderRadius: wp(2), marginLeft: wp(3), overflow: 'hidden' }} >
                                    <LinearGradient
                                        colors={[COLORS.RoyalBlueViolet, COLORS.DeepTeal]}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                        style={StyleSheet.absoluteFill}
                                    />
                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                        <SVGS.SHARE width={wp(5)} height={hp(3)} />
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                    <FlatList
                        data={tripDays}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {

                            let hotels = [], activities = [], restaurants = [];

                            if (item?.items && Array.isArray(item.items)) {
                                // ✅ Handles both `type` and `category` fields
                                hotels = item.items.filter((place) => place.type?.toLowerCase() === "hotel" || place.category === "Hotel");
                                activities = item.items.filter((place) => place.type?.toLowerCase() === "activity" || place.category === "Activity");
                                restaurants = item.items.filter((place) => place.type?.toLowerCase() === "restaurant" || place.category === "Restaurant");
                            } else if (item?.sections) {
                                // ✅ Handles `sections` format
                                hotels = item.sections.hotels || [];
                                activities = item.sections.activities || [];
                                restaurants = item.sections.restaurants || [];
                            }

                            return (
                                <View style={styles.dayContainer}>
                                    {/* Expandable Header */}
                                    <TouchableOpacity
                                        onPress={() => setExpanded(expanded === index ? null : index)}
                                        style={styles.dayHeader}
                                    >
                                        <View>
                                            <Text style={styles.dayTitle}>Day {index + 1}: {formatDisplayDate(item.day)}</Text>
                                            <Text style={{ color: COLORS.RoyalBlue, fontFamily: fontFamily.FONTS.Medium, fontSize: hp(1.7) }}>
                                                ${[...hotels, ...activities, ...restaurants].reduce((total, place) => {
                                                    const price = place.price ? parseFloat(place.price.toString().replace('$', '')) : 0;
                                                    return total + price;
                                                }, 0).toFixed(2)}
                                            </Text>
                                        </View>
                                        <Ionicons name={expanded === index ? 'chevron-up' : 'chevron-down'} size={wp(5)} color={COLORS.black} />
                                    </TouchableOpacity>

                                    {expanded === index && (
                                        <View style={styles.optionsContainer}>

                                            {/* Hotel Section */}
                                            <OptionButton title="Add Hotel" Icon={SVGS.AIHOTEL} onPress={() => handleAddItem('hotel', index)} />
                                            {hotels.map((hotel, hotelIndex) => (
                                                <TouchableOpacity key={hotelIndex} onPress={() => handleItemPress(hotel, index)} activeOpacity={0.7}>
                                                    <View >
                                                        <View style={styles.placeContainer}>
                                                            <View style={styles.imageContainer}>
                                                                <FastImage
                                                                    source={{
                                                                        uri: hotel.image || (hotel.photos?.length > 0 ? hotel.photos[0].url : "fallback-image-url"),
                                                                        priority: FastImage.priority.high,
                                                                        cache: FastImage.cacheControl.immutable
                                                                    }}
                                                                    style={styles.placeImage}
                                                                />

                                                                <View style={styles.badge}>
                                                                    <Text style={styles.badgeText}>{hotelIndex + 1}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.placeDetails}>
                                                                <Text style={styles.placeTitle} numberOfLines={1}>{hotel.title || hotel.name || "Unnamed Hotel"}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: wp(49) }}>
                                                                    <Ionicons name="location-outline" size={hp(2)} style={{ paddingRight: wp(1) }} color={COLORS.Midgray} />
                                                                    <Text style={styles.placeAddress} numberOfLines={2}>{hotel.location?.address || hotel.address || "Unnamed Hotel"}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                                                <Text style={styles.placePrice}>${hotel.price || 0}</Text>
                                                                <Text style={styles.placeCategory} numberOfLines={1}>
                                                                    ⭐ {hotel.rating && hotel.rating !== "N/A" ? hotel.rating : 0}
                                                                </Text>

                                                            </View>
                                                        </View>

                                                        {hotelIndex < hotels.length - 1 && (
                                                            <View style={styles.distanceContainer}>
                                                                {/* Ensure we use either hotel.name or hotel.title */}
                                                                {(() => {
                                                                    const currentHotelName = hotel.name || hotel.title || "Unnamed Hotel";
                                                                    const nextHotelName = hotels[hotelIndex + 1]?.name || hotels[hotelIndex + 1]?.title || "Unnamed Hotel";
                                                                    return (
                                                                        <>
                                                                            <Text style={styles.distanceText}>
                                                                                ⏱ {distances[`${currentHotelName}-${nextHotelName}`]?.distance || "Calculating..."}
                                                                            </Text>
                                                                            <Text style={styles.timeText}>
                                                                                📏 {distances[`${currentHotelName}-${nextHotelName}`]?.duration || "Calculating..."}
                                                                            </Text>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </View>
                                                        )}


                                                    </View>
                                                </TouchableOpacity>
                                            ))}

                                            {/* Activity Section */}
                                            <OptionButton title="Add Places" Icon={SVGS.ACTIVITY} isImage={true} onPress={() => handleAddItem('activity', index)} />
                                            {activities.map((activity, activityIndex) => (
                                                <TouchableOpacity key={activityIndex} onPress={() => handleItemPress(activity, index)} activeOpacity={0.7}>
                                                    <View >
                                                        <View style={styles.placeContainer}>
                                                            <View style={styles.imageContainer}>
                                                                <FastImage
                                                                    source={{
                                                                        uri: activity.image || (activity.photos?.length > 0 ? activity.photos[0].url : "fallback-image-url"),
                                                                        priority: FastImage.priority.high,
                                                                        cache: FastImage.cacheControl.immutable
                                                                    }}
                                                                    style={styles.placeImage}
                                                                />

                                                                {/* <Image source={{ uri: activity.image || "" }} style={styles.placeImage} /> */}
                                                                <View style={styles.badge}>
                                                                    <Text style={styles.badgeText}>{activityIndex + 1}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.placeDetails}>
                                                                <Text style={styles.placeTitle} numberOfLines={1}>{activity.title || activity.name || "Unnamed Activity"}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: wp(49) }}>
                                                                    <Ionicons name="location-outline" size={hp(2)} style={{ paddingRight: wp(1) }} color={COLORS.Midgray} />
                                                                    <Text style={styles.placeAddress} numberOfLines={2}>{activity.location?.address || activity.address || "Unnamed Hotel"}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                                                <Text style={styles.placePrice}>${activity.price || 0}</Text>
                                                                <Text style={styles.placeCategory} numberOfLines={1}>
                                                                    ⭐ {activity.rating && activity.rating !== "N/A" ? activity.rating : 0}
                                                                </Text>

                                                            </View>
                                                        </View>

                                                        {activityIndex < activities.length - 1 && (
                                                            <View style={styles.distanceContainer}>
                                                              
                                                                {(() => {
                                                                    const currentActivityName = activity.name || activity.title || "Unnamed Activity";
                                                                    const nextActivityName = activities[activityIndex + 1]?.name || activities[activityIndex + 1]?.title || "Unnamed Activity";

                                                                    return (
                                                                        <>
                                                                            <Text style={styles.distanceText}>
                                                                                ⏱ {distances[`${currentActivityName}-${nextActivityName}`]?.distance || "Calculating..."}
                                                                            </Text>
                                                                            <Text style={styles.timeText}>
                                                                                📏 {distances[`${currentActivityName}-${nextActivityName}`]?.duration || "Calculating..."}
                                                                            </Text>
                                                                        </>
                                                                    );
                                                                })()}
                                                                {/* <Text style={styles.distanceText}>{distances[`${activity.name}-${activities[activityIndex + 1]?.name}`]?.distance || "N/A"}</Text>
                                                            <Text style={styles.timeText}>{distances[`${activity.name}-${activities[activityIndex + 1]?.name}`]?.duration || "N/A"}</Text> */}
                                                            </View>
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            ))}

                                            {/* Restaurant Section */}
                                            <OptionButton title="Add Restaurants" Icon={SVGS.RESTAURANTS} onPress={() => handleAddItem('restaurant', index)} />
                                            {restaurants.map((restaurant, restaurantIndex) => (
                                                <TouchableOpacity key={restaurantIndex} onPress={() => handleItemPress(restaurant, index)} activeOpacity={0.7}>
                                                    <View>
                                                        <View style={styles.placeContainer}>
                                                            <View style={styles.imageContainer}>
                                                                <FastImage
                                                                    source={{
                                                                        uri: restaurant.image || (restaurant.photos?.length > 0 ? restaurant.photos[0].url : "fallback-image-url"),
                                                                        priority: FastImage.priority.high,
                                                                        cache: FastImage.cacheControl.immutable
                                                                    }}
                                                                    style={styles.placeImage}
                                                                />


                                                                {/* <Image source={{ uri: restaurant.image || "" }} style={styles.placeImage} /> */}
                                                                <View style={styles.badge}>
                                                                    <Text style={styles.badgeText}>{restaurantIndex + 1}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.placeDetails}>
                                                                <Text style={styles.placeTitle} numberOfLines={1}>{restaurant.title || restaurant.name || "Unnamed Restaurant"}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: wp(49) }}>
                                                                    <Ionicons name="location-outline" size={hp(2)} style={{ paddingRight: wp(1) }} color={COLORS.Midgray} />
                                                                    <Text style={styles.placeAddress} numberOfLines={2}>{restaurant.location?.address || restaurant.address || "Unnamed Hotel"}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                                                <Text style={styles.placePrice}>${restaurant.price || 0}</Text>
                                                                <Text style={styles.placeCategory} numberOfLines={1}>
                                                                    ⭐ {restaurant.rating && restaurant.rating !== "N/A" ? restaurant.rating : 0}
                                                                </Text>
                                                            </View>
                                                        </View>

                                                        {restaurantIndex < restaurants.length - 1 && (
                                                            <View style={styles.distanceContainer}>
                                                                {(() => {
                                                                    const currentRestaurantName = restaurant.name || restaurant.title || "Unnamed Restaurant";
                                                                    const nextRestaurantName = restaurants[restaurantIndex + 1]?.name || restaurants[restaurantIndex + 1]?.title || "Unnamed Restaurant";
                                                                    return (
                                                                        <>
                                                                            <Text style={styles.distanceText}>
                                                                                ⏱ {distances[`${currentRestaurantName}-${nextRestaurantName}`]?.distance || "Calculating..."}
                                                                            </Text>
                                                                            <Text style={styles.timeText}>
                                                                                📏 {distances[`${currentRestaurantName}-${nextRestaurantName}`]?.duration || "Calculating..."}
                                                                            </Text>
                                                                        </>
                                                                    );
                                                                })()}
                                                                {/* <Text style={styles.distanceText}>{distances[`${restaurant.name}-${restaurants[restaurantIndex + 1]?.name}`]?.distance || "N/A"}</Text>
                                                            <Text style={styles.timeText}>{distances[`${restaurant.name}-${restaurants[restaurantIndex + 1]?.name}`]?.duration || "N/A"}</Text> */}
                                                            </View>
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            ))}

                                        </View>
                                    )}
                                </View>
                            );
                        }}
                    />

                </View>
            </ScrollView>
            {/* Bottom Sheet */}
            <RBSheet
                ref={refRBSheet}
                height={hp(28)}
                closeOnPressBack={true}
                closeOnDragDown={true}
                openDuration={250}
                customStyles={{
                    container: {
                        borderTopLeftRadius: wp(5),
                        borderTopRightRadius: wp(5),
                        padding: wp(3),
                        backgroundColor: COLORS.white,
                    }
                }}
            >
                <View>
                    {/* Option: View the Place */}
                    <TouchableOpacity style={styles.bottomSheetButton} onPress={() => handlePlaceAction(selectedItem, "viewPlace")} >
                        <Ionicons name="location-outline" size={wp(6)} color={COLORS.darkgray} />
                        <Text style={styles.bottomSheetText}>View the Place</Text>
                    </TouchableOpacity>

                    {/* Option: Directions */}
                    <TouchableOpacity style={styles.bottomSheetButton} onPress={() => handlePlaceAction(selectedItem, "directions")}>
                        <Ionicons name="paper-plane-outline" size={wp(6)} color={COLORS.darkgray} />
                        <Text style={styles.bottomSheetText}>Directions</Text>
                    </TouchableOpacity>

                    {/* Option: Website */}
                    <TouchableOpacity style={[styles.bottomSheetButton,]} onPress={() => handlePlaceAction(selectedItem, "website")}>
                        <Ionicons name="globe-outline" size={wp(6)} color={COLORS.darkgray} />
                        <Text style={styles.bottomSheetText}>Website</Text>
                    </TouchableOpacity>

                    {/* Option: Delete from the List */}
                    <TouchableOpacity style={[styles.bottomSheetButton, { borderBottomWidth: 0 }]} onPress={handleDeleteItem}>
                        <Ionicons name="trash-outline" size={wp(6)} color={COLORS.red} />
                        <Text style={[styles.bottomSheetText, { color: COLORS.red }]}>Delete from the List</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggelModel}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', // Full width
                        height: '100%', // Full height
                        position: 'absolute', // Cover the entire screen
                        top: 0,
                        left: 0
                    }}>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={{
                                width: "100%", justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <View style={styles.reportModelContainer}>

                                {/* 🔹 Header with LinearGradient */}
                                <LinearGradient
                                    colors={[COLORS.RoyalBlueViolet, COLORS.DeepTeal]}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                    style={styles.modalHeader} // Use styles to apply border radius
                                >
                                    <Text style={styles.headerText}>Share Itinerary</Text>
                                    <TouchableOpacity onPress={toggelModel}>
                                        <Entypo name="cross" size={hp(3)} color={COLORS.white} />
                                    </TouchableOpacity>
                                </LinearGradient>

                                <View style={{ paddingHorizontal: 4, marginVertical: hp(2) }}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter Email"
                                            placeholderTextColor={COLORS.Midgray}
                                            keyboardType='email-address'
                                            value={email}
                                            onChangeText={(text) => setEmail(text)}
                                            style={styles.input}
                                        />
                                    </View>

                                    {/* Error Message (Visible only if emailError exists) */}
                                    {emailError ? (
                                        <Text style={styles.errorText}>{emailError}</Text>
                                    ) : null}

                                    <View style={{ flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity style={styles.sendButton} onPress={handleShareItinerary}>
                                            {loading ? (
                                                <ActivityIndicator color={COLORS.white} size="large" />
                                            ) : (
                                                <Text style={styles.sendButtonText}>Send</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView >
    );
};

const OptionButton = ({ title, Icon, isImage, onPress }) => (
    <View style={styles.optionButton}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isImage ? (
                <Image source={Icon} style={{ width: hp(3), height: hp(2.6), marginRight: wp(2) }} resizeMode='contain' />
            ) : (
                <Icon width={hp(3)} height={hp(2.6)} style={{ marginRight: wp(2) }} />
            )}
            <Text style={styles.optionText}>{title}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <Octicons name='diff-added' size={hp(2.9)} color={COLORS.RoyalBlue} />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    headerImage: { height: hp(30), justifyContent: 'center', alignItems: 'center' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    backButton: {
        position: 'absolute',
        top: hp(7),  // Adjust based on safe area
        left: wp(3),
        padding: wp(2),
    },

    // Toggle Button Styles
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        width: wp(25),
        height: hp(4.3),
        alignItems: 'center',
        position: 'absolute',
        top: hp(7),
        right: wp(5),
    },
    slider: {
        position: 'absolute',
        width: wp(13),
        height: '100%',
        borderRadius: wp(2),
        left: 0, // Starts at left (Map selected)
    },
    toggleButton: {
        flex: 1,
        paddingHorizontal: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    toggleText: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
    },
    activeText: {
        color: COLORS.white,
    },
    fullButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    tripInfo: {
        padding: wp(4),
        backgroundColor: COLORS.white,
        marginTop: -hp(8),
        borderRadius: wp(4),
        marginHorizontal: wp(4),
        borderColor: COLORS.gray,
        borderWidth: 0.7,
        marginBottom: hp(1)
    },
    title: {
        fontSize: hp(2.2),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.black
    },
    date: {
        color: COLORS.Midgray,
        fontFamily: fontFamily.FONTS.Medium,
        marginVertical: hp(0.5),
        fontSize: hp(1.7)
    },
    description: {
        color: COLORS.darkgray1,
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(1.6)
    },
    budgetContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(0.8)
    },
    budgetText: {
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        fontSize: hp(1.5)
    },
    budgetAmount: {
        color: COLORS.RoyalBlue,
        fontFamily: fontFamily.FONTS.Medium,
        marginLeft: wp(2),
        fontSize: hp(1.8)
    },
    saveButton: {
        borderColor: COLORS.Midgray,
        borderWidth: 0.5,
        height: hp(3.5),
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(20),
        flexDirection: 'row',
        borderRadius: wp(2),
    },
    buttonText: {
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        fontSize: hp(1.7),
        marginLeft: wp(1)
    },
    dayContainer: {
        backgroundColor: COLORS.white,
        marginHorizontal: wp(4),
        marginVertical: hp(1),
        borderRadius: wp(3),
        borderColor: COLORS.gray,
        borderWidth: 0.7
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: wp(4)
    },
    dayTitle: {
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        fontSize: hp(1.8)
    },
    optionsContainer: {
        padding: wp(2.5)
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: hp(1),
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        marginVertical: hp(0.8)
    },
    optionText: {
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        fontSize: hp(2)
    },
    placeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(1.5),
        borderRadius: wp(2),
        marginVertical: hp(0.5),
        backgroundColor: '#f5f5f5',
    },
    imageContainer: {
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: -5, // Adjust for positioning
        left: -5, // Adjust for positioning
        backgroundColor: COLORS.RoyalBlue,
        width: wp(5.5),
        height: wp(5.5),
        borderRadius: wp(5.5),
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: COLORS.white,
        fontFamily: fontFamily.FONTS.bold,
        fontSize: hp(1.5),
    },
    placeImage: {
        width: wp(15),
        height: wp(15),
        borderRadius: wp(2),
        marginRight: wp(3),
    },
    placeDetails: {
        flex: 1,
    },
    placeTitle: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.black,
        paddingRight: wp(2.2),

    },
    placeAddress: {
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.Midgray,
        fontSize: hp(1.8)
    },
    placeCategory: {
        fontSize: hp(1.6),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
    },
    placePrice: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.RoyalBlue,
    },
    distanceContainer: {
        flexDirection: "row",
        alignItems: 'center',
        marginTop: hp(0.5),
        borderRadius: wp(2),
    },
    distanceText: {
        fontSize: hp(1.5),
        color: COLORS.darkgray,
        paddingHorizontal: wp(3),
        fontFamily: fontFamily.FONTS.Medium
    },
    timeText: {
        fontSize: hp(1.5),
        paddingHorizontal: wp(3),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
    },
    bottomSheetButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp(1.5),
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.Midgray,
    },
    bottomSheetText: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        marginLeft: wp(3),
    },
    inputContainer: {
        width: '98%',
        marginHorizontal: wp(1),
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(1),
        height: hp(6),
        borderColor: COLORS.Midgray,
        borderWidth: 0.5,
        borderRadius: wp(2),
        paddingLeft: wp(2),
    },
    input: {
        flex: 1,
        paddingLeft: wp(2),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(2),
    },
    reportModelContainer: {
        backgroundColor: COLORS.white,
        width: '95%',
        borderRadius: wp(3),
        overflow: "hidden", // Ensures border radius applies
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: hp(1.8),
        borderTopRightRadius: wp(2),
        borderTopLeftRadius: wp(2),
    },
    headerText: {
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(2.4),
        color: COLORS.white,
    },
    errorText: {
        color: "red",
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.Medium,
        marginTop: hp(1),
        marginLeft: wp(1),
    },
    sendButton: {
        backgroundColor: COLORS.red,
        borderRadius: wp(2),
        height: hp(4.5),
        width: wp(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(2.2),
        color: COLORS.white,
    },
});

export default AiPlanTripDetails;
