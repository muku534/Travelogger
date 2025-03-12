import React, { act, useEffect, useRef, useState, version } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Animated, Image, ScrollView, Linking, Modal, TextInput, ActivityIndicator, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS, fontFamily, Images, SVGS } from '../../../constants';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import Toast from "react-native-toast-message";
import { createItineraries, ShareItinerary, updateItineraryById } from '../../services/planTripService';
import logger from '../../utils/logger';
import RBSheet from 'react-native-raw-bottom-sheet';
import { DELETE_TRIP_DAY_ITEM } from '../../redux/Actions';

const PlanTripDetails = ({ navigation, route }) => {
    const refRBSheet = useRef(null); // Bottom Sheet Ref
    const dispatch = useDispatch();
    const { itineraryId, destination, startDate, endDate, tripImg, coordinates, tripDays } = useSelector(state => state.tripDetails);
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState("");
    const [expanded, setExpanded] = useState(null);
    const [activeTab, setActiveTab] = useState('List');
    const sliderAnim = useRef(new Animated.Value(wp(12))).current; // Start at 'List' position
    const userData = useSelector(state => state.userData);
    const [loading, setLoading] = useState(false);
    const [distances, setDistances] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);

    const handleShareItinerary = async () => {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError("Email is required");
            setTimeout(() => setEmailError(""), 800); // Hide error after 800ms
            return;
        }
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            setTimeout(() => setEmailError(""), 800); // Hide error after 800ms
            return;
        }

        setEmailError(""); // Clear error if valid
        setLoading(true); // Show loading indicator

        const formatDate = (dateString) => {
            const dateObj = new Date(dateString);
            return dateObj.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
        };

        // Format itinerary data for API
        const itineraryData = {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            recipientEmail: email, // Use entered email
            dayPlans: tripDays
                .map((day) => ({
                    date: formatDate(day.day), // Convert to YYYY-MM-DD
                    locations: day.items
                        .filter((item) => item.title) // Ensure valid locations
                        .map((item) => ({
                            name: item.title || "Unknown Location",
                            category: item.type || "activity",
                            address: item.location?.address || item.description || "No Address",
                        })),
                }))
                .filter((day) => day.locations.length > 0), // Remove empty `locations`
        };

        try {
            await ShareItinerary(itineraryData); // Call API function

            // Show success toast
            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Itinerary shared successfully!",
            });

            toggelModel(); // Close modal after success
            setEmail(""); // Reset email input
        } catch (error) {
            // Show error toast
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "Failed to send itinerary.",
            });
            console.error("Email send error:", error);
        } finally {
            setLoading(false); // Hide loading indicator
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
        const R = 3958.8; // Radius of Earth in miles

        const lat1 = toRad(coords1?.latitude);
        const lon1 = toRad(coords1?.longitude);
        const lat2 = toRad(coords2?.latitude);
        const lon2 = toRad(coords2?.longitude);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (R * c).toFixed(2); // Returns distance in miles
    };

    // Estimate Duration Based on Distance
    const estimateDuration = (distance, category) => {
        let speedMph = 50; // Default speed (Car travel)

        if (category === "Walking") speedMph = 3;
        if (category === "Biking") speedMph = 12;

        const durationHours = distance / speedMph;
        const durationMinutes = Math.round(durationHours * 60);

        return durationMinutes > 60
            ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
            : `${durationMinutes} min`;
    };

    // Extract coordinates from different structures
    const getCoordinates = (place) => {
        if (!place) return null;

        // Case 1: Coordinates in an array format
        if (Array.isArray(place.coordinates) && place.coordinates.length === 2) {
            return { latitude: place.coordinates[0], longitude: place.coordinates[1] };
        }

        // Case 2: Coordinates in an object format
        if (place.coordinates && typeof place.coordinates === "object") {
            return { latitude: place.coordinates.latitude, longitude: place.coordinates.longitude };
        }

        // Case 3: Coordinates inside a nested `location` object
        if (place.location?.coordinates && Array.isArray(place.location.coordinates)) {
            return { latitude: place.location.coordinates[0], longitude: place.location.coordinates[1] };
        }

        return null;
    };

    // Function to calculate distances locally
    const calculateDistances = () => {
        let newDistances = {};

        for (let i = 0; i < tripDays.length; i++) {
            let places = [];

            // Handle all possible structures (items, sections, hotels, etc.)
            if (Array.isArray(tripDays[i]?.items)) {
                places = tripDays[i].items;
            } else if (tripDays[i]?.sections) {
                places = [
                    ...(tripDays[i].sections.hotels || []),
                    ...(tripDays[i].sections.activities || []),
                    ...(tripDays[i].sections.restaurants || [])
                ];
            }

            // Skip if there are fewer than two places
            if (!places || places.length < 2) continue;

            for (let j = 0; j < places.length - 1; j++) {
                let origin = getCoordinates(places[j]);
                let destination = getCoordinates(places[j + 1]);
                let category = places[j]?.category || places[j]?.type;

                // Use name/title for better logging
                const originName = places[j]?.name || places[j]?.title || "Unnamed Place";
                const destinationName = places[j + 1]?.name || places[j + 1]?.title || "Unnamed Place";

                // Skip if either location is missing coordinates
                if (!origin || !destination || !origin.latitude || !origin.longitude || !destination.latitude || !destination.longitude) {
                    logger.warn(`❌ Missing coordinates for: ${originName} or ${destinationName}`);
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

    // Run `calculateDistances` when tripDays change
    useEffect(() => {
        calculateDistances();
    }, [tripDays]);

    const handleAddItem = (type, dayIndex) => {
        navigation.navigate("SearchScreen", { type, dayIndex, isSearchOnly: false, coordinates });
    };

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // ✅ Ensure two-digit month
        const day = String(date.getDate()).padStart(2, '0'); // ✅ Ensure two-digit day
        return `${year}-${month}-${day}`;
    };

    const handleSaveItinerary = async () => {
        const hotels = tripDays[0]
        console.log("before sending hotels", hotels)
        try {
            // console.log("before sending  tripDays", tripDays)
            const itineraryData = {
                itinerary: {
                    userId: userData.userId,
                    title: `${destination} Trip ${new Date().getFullYear()}`,
                    status: "draft",
                    visibility: "private",
                    generatedBy: "manual",
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
                                    description: hotel.address || hotel.description || "",
                                    location: {
                                        name: hotel.address || hotel.name || hotel.location?.name || "",
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
                                    duration: !isNaN(hotel.duration) ? Number(hotel.duration) : 0,
                                    price: !isNaN(hotel.price) ? Number(hotel.price) : 0,
                                    priceLevel: !isNaN(hotel.priceLevel) ? Number(hotel.priceLevel) : 1,
                                    rating: !isNaN(hotel.rating) ? Number(hotel.rating) : 0,
                                    userRatingsTotal: !isNaN(hotel.userRatingsTotal) ? Number(hotel.userRatingsTotal) : 0,
                                    photos: hotel.photos && Array.isArray(hotel.photos)
                                        ? hotel.photos.map(photo => ({ url: photo.url, caption: photo.caption || null }))
                                        : hotel.image ? [{ url: hotel.image }] : [],
                                    contact: {
                                        phone: hotel.contact?.phone || hotel.phone || "",
                                        email: hotel.contact?.email || "",
                                        website: hotel.contact?.website || hotel.website || "",
                                        googleMapsUrl: hotel.contact?.googleMapsUrl || hotel.googleMapsUrl || "",
                                    },
                                    operatingHours: hotel.operatingHours || {},
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
                                    title: activity.name || activity.title || "",
                                    description: activity.address || activity.description || "",
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
                                    duration: !isNaN(activity.duration) ? Number(activity.duration) : 0,
                                    price: !isNaN(activity.price) ? Number(activity.price) : 0,
                                    priceLevel: !isNaN(activity.priceLevel) ? Number(activity.priceLevel) : 1,
                                    rating: !isNaN(activity.rating) ? Number(activity.rating) : 0,
                                    userRatingsTotal: !isNaN(activity.userRatingsTotal) ? Number(activity.userRatingsTotal) : 0,
                                    photos: activity.photos && Array.isArray(activity.photos)
                                        ? activity.photos.map(photo => ({ url: photo.url, caption: photo.caption || null }))
                                        : activity.image ? [{ url: activity.image }] : [],
                                    contact: {
                                        phone: activity.contact?.phone || activity.phone || "",
                                        email: activity.contact?.email || activity.email || "",
                                        website: activity.contact?.website || activity.website || "",
                                        googleMapsUrl: activity.contact?.googleMapsUrl || activity.googleMapsUrl || "",
                                    },
                                    operatingHours: activity.operatingHours || {},
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
                                    duration: !isNaN(restaurant.duration) ? Number(restaurant.duration) : 0,
                                    price: !isNaN(restaurant.price) ? Number(restaurant.price) : 0,
                                    priceLevel: !isNaN(restaurant.priceLevel) ? Number(restaurant.priceLevel) : 1,
                                    rating: !isNaN(restaurant.rating) ? Number(restaurant.rating) : 0,
                                    userRatingsTotal: !isNaN(restaurant.userRatingsTotal) ? Number(restaurant.userRatingsTotal) : 0,
                                    photos: restaurant.photos && Array.isArray(restaurant.photos)
                                        ? restaurant.photos.map(photo => ({ url: photo.url, caption: photo.caption || null }))
                                        : restaurant.image ? [{ url: restaurant.image }] : [],
                                    contact: {
                                        phone: restaurant?.contact?.phone || restaurant.phone || "",
                                        email: restaurant?.contact?.email || restaurant.email || "",
                                        website: restaurant?.contact?.website || restaurant.website || "",
                                        googleMapsUrl: restaurant?.contact?.googleMapsUrl || restaurant.googleMapsUrl || "",
                                    },
                                    operatingHours: restaurant.operatingHours || {},
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
                }
            };

            console.log("Saving Itinerary - ID:", itineraryId);
            console.log("Saving Itinerary - Data:", JSON.stringify(itineraryData, null, 2))

            if (itineraryId) {
                await updateItineraryById(itineraryId, itineraryData);
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Itinerary updated successfully!",
                });
            } else {
                await createItineraries(itineraryData);
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
        }
    };

    const handleItemPress = (item, dayIndex) => {
        setSelectedItem({ ...item, dayIndex }); // Store item and its day index
        console.log("Selected Item for deletion:", { ...item, dayIndex });
        refRBSheet.current.open();  // Open the bottom sheet
    };

    const handlePlaceAction = (place, actionType) => {
        if (!place || !place.location || !Array.isArray(place.location.coordinates)) {
            alert("Location data is missing.");
            return;
        }

        const { coordinates } = place.location;
        const [latitude, longitude] = coordinates;

        console.log("Place location coordinates:", coordinates);

        try {
            switch (actionType) {
                case "viewPlace":
                    if (latitude && longitude) {
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                        Linking.openURL(mapsUrl);
                    } else {
                        alert("Coordinates not available.");
                    }
                    break;

                case "directions":
                    if (latitude && longitude) {
                        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
                        Linking.openURL(directionsUrl);
                    } else {
                        alert("Coordinates not available.");
                    }
                    break;

                case "website":
                    let websiteUrl = place.contact?.website?.trim();

                    // If the website URL is missing or empty, open Google
                    if (!websiteUrl) {
                        websiteUrl = "https://www.google.com";
                    }
                    // If the URL does NOT start with http or https, prepend "https://"
                    else if (!/^https?:\/\//i.test(websiteUrl)) {
                        websiteUrl = `https://${websiteUrl}`;
                    }

                    Linking.openURL(websiteUrl);
                    break;

                default:
                    alert("Invalid action.");
            }
        } catch (error) {
            console.error("Error opening URL:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleDeleteItem = () => {
        if (!selectedItem || selectedItem.dayIndex === undefined) {
            console.log("No valid item selected for deletion.");
            return;
        }

        console.log("Deleting item from Day Index:", selectedItem.dayIndex, "Item ID:", selectedItem.id);

        dispatch({
            type: DELETE_TRIP_DAY_ITEM,
            payload: {
                dayIndex: selectedItem.dayIndex, // Identify the correct day
                itemId: selectedItem.id,        // Identify the correct item
            },
        });

        console.log(`Deleted item with ID: ${selectedItem.id} from dayIndex: ${selectedItem.dayIndex}`);

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


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent backgroundColor="transparent" barStyle={activeTab === 'List' ? 'light-content' : 'dark-content'} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(2) }} >
                <View style={styles.container}>
                    {/* Header Image with Overlay */}
                    {activeTab === 'List' ? (
                        <ImageBackground source={{ uri: tripImg }} style={styles.headerImage}>
                            <View style={styles.overlay} />
                        </ImageBackground>
                    ) : (
                        <MapView
                            provider="google"
                            style={{ width: wp(100), height: hp(30) }}
                            initialRegion={{
                                latitude: coordinates?.[0] || 22.3193, // Default if missing
                                longitude: coordinates?.[1] || 114.1694,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1,
                            }}
                        >
                            {/* ✅ Show Main Destination Marker */}
                            <Marker
                                coordinate={{
                                    latitude: coordinates?.[0] || 22.3193,
                                    longitude: coordinates?.[1] || 114.1694,
                                }}
                                title={destination}
                                description="Main Destination"
                            />

                            {/* ✅ Loop through `tripDays` and show all places */}
                            {tripDays?.map((day, dayIndex) =>
                                day.items?.map((place, placeIndex) => {
                                    const placeCoords = place?.location?.coordinates;
                                    if (!placeCoords || placeCoords.length !== 2) return null; // Ensure valid coordinates

                                    return (
                                        <Marker
                                            key={`marker-${dayIndex}-${placeIndex}`}
                                            coordinate={{
                                                latitude: placeCoords[0],
                                                longitude: placeCoords[1],
                                            }}
                                            title={place.name || "Unknown Place"}
                                            description={place.description || "No description available"}
                                        >
                                            <Image source={getMarkerImage(place.type)} style={styles.customMarker} />
                                        </Marker>
                                    );
                                })
                            )}
                        </MapView>

                    )}

                    {/* Back Button */}
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons
                            name="arrow-back"
                            size={hp(3)}
                            color={activeTab === 'List' ? COLORS.white : COLORS.darkgray}
                        />
                    </TouchableOpacity>

                    {/* Toggle Switch */}
                    <View style={styles.toggleContainer}>
                        <Animated.View style={[styles.slider, { transform: [{ translateX: sliderAnim }] }]} />

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
                            <SVGS.CALENDARICON width={wp(4)} height={hp(2)} />
                            <Text style={styles.date}>  {startDate} - {endDate}</Text>
                        </View>
                        <Text style={styles.description}>Plan your Trip day by day. Add Hotels, Restaurants, and Activities to create a Perfect Itinerary</Text>
                        <View style={styles.budgetContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <SVGS.BUDGETICON width={wp(5)} height={hp(4)} />
                                <View style={{ paddingHorizontal: wp(1) }}>
                                    <Text style={styles.budgetText}>Total Budget</Text>
                                    <Text style={styles.budgetAmount}>$0.0</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(3), marginLeft: 'auto' }}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveItinerary} activeOpacity={0.5}>
                                    <SVGS.SAVEICON width={wp(5)} height={hp(2)} />
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: COLORS.red, height: hp(3.5), width: wp(9), justifyContent: 'center', alignItems: 'center', borderRadius: wp(2), marginLeft: wp(3) }} onPress={() => setModalVisible(true)} activeOpacity={0.5}>
                                    <SVGS.SHARE width={wp(5)} height={hp(3)} />
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
                                hotels = item.items.filter((place) => place.type?.toLowerCase() === "hotel");
                                activities = item.items.filter((place) => place.type?.toLowerCase() === "activity");
                                restaurants = item.items.filter((place) => place.type?.toLowerCase() === "restaurant");
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
                                            <Text style={styles.dayTitle}>Day {index + 1}: {item.day}</Text>
                                            <Text style={{ color: COLORS.red, fontFamily: fontFamily.FONTS.Medium, fontSize: hp(1.7) }}>
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
                                            <OptionButton title="Add Hotel" Icon={SVGS.HOTEL} onPress={() => handleAddItem('hotel', index)} />
                                            {hotels.map((hotel, hotelIndex) => (
                                                <TouchableOpacity key={hotelIndex} onPress={() => handleItemPress(hotel, index)} activeOpacity={0.7}>
                                                    <View>
                                                        <View style={styles.placeContainer}>
                                                            <View style={styles.imageContainer}>
                                                                <Image
                                                                    source={{ uri: hotel.image || (hotel.photos?.length > 0 ? hotel.photos[0].url : "fallback-image-url") }}
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
                                                                <Text style={styles.placeCategory} numberOfLines={1}>⭐ {hotel.rating || "N/A"}</Text>
                                                            </View>
                                                        </View>

                                                        {hotelIndex < hotels.length - 1 && (
                                                            <View style={styles.distanceContainer}>
                                                                {console.log("Hotel Object:", hotel)}
                                                                {console.log("Hotels Array:", hotels)}
                                                                {console.log("Next Hotel Object:", hotels[hotelIndex + 1])}

                                                                {/* Ensure we use either hotel.name or hotel.title */}
                                                                {(() => {
                                                                    const currentHotelName = hotel.name || hotel.title || "Unnamed Hotel";
                                                                    const nextHotelName = hotels[hotelIndex + 1]?.name || hotels[hotelIndex + 1]?.title || "Unnamed Hotel";

                                                                    console.log("Current Hotel:", currentHotelName);
                                                                    console.log("Next Hotel:", nextHotelName);
                                                                    console.log("Distance Info:", distances[`${currentHotelName}-${nextHotelName}`]);

                                                                    return (
                                                                        <>
                                                                            <Text style={styles.distanceText}>
                                                                                ⏱ {distances[`${currentHotelName}-${nextHotelName}`]?.distance || "N/A"}
                                                                            </Text>
                                                                            <Text style={styles.timeText}>
                                                                                📏 {distances[`${currentHotelName}-${nextHotelName}`]?.duration || "N/A"}
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
                                            <OptionButton title="Add Activities" Icon={SVGS.ACTIVITYICON} isImage={true} onPress={() => handleAddItem('activity', index)} />
                                            {activities.map((activity, activityIndex) => (
                                                <TouchableOpacity key={activityIndex} onPress={() => handleItemPress(activity, index)} activeOpacity={0.7}>
                                                    <View>
                                                        <View style={styles.placeContainer}>
                                                            <View style={styles.imageContainer}>
                                                                <Image
                                                                    source={{ uri: activity.image || (activity.photos?.length > 0 ? activity.photos[0].url : "fallback-image-url") }}
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
                                                                <Text style={styles.placeCategory} numberOfLines={1}>⭐ {activity.rating || "N/A"}</Text>
                                                            </View>
                                                        </View>

                                                        {activityIndex < activities.length - 1 && (
                                                            <View style={styles.distanceContainer}>
                                                                {console.log("activity Object:", activity)}
                                                                {console.log("activities Array:", activities)}
                                                                {console.log("Next activities Object:", activities[activityIndex + 1])}

                                                                {/* Ensure we use either hotel.name or hotel.title */}
                                                                {(() => {
                                                                    const currentActivity = activity.title || activity.name || "Unnamed Activity";
                                                                    const nextActivity = activities[activityIndex + 1]?.title || activities[activityIndex + 1]?.name || "Unnamed Activity";

                                                                    return (
                                                                        <>
                                                                            <Text style={styles.distanceText}> ⏱ {distances[`${currentActivity}-${nextActivity}`]?.distance || "N/A"}</Text>
                                                                            <Text style={styles.timeText}> 📏 {distances[`${currentActivity}-${nextActivity}`]?.duration || "N/A"}</Text>
                                                                        </>
                                                                    );
                                                                })()}

                                                            </View>

                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            ))}

                                            {/* Restaurant Section */}
                                            <OptionButton title="Add Restaurants" Icon={SVGS.RESTAURANT} onPress={() => handleAddItem('restaurant', index)} />
                                            {restaurants.map((restaurant, restaurantIndex) => (
                                                <TouchableOpacity key={restaurantIndex} onPress={() => handleItemPress(restaurant, index)} activeOpacity={0.7}>
                                                    <View>
                                                        <View style={styles.placeContainer}>
                                                            <View style={styles.imageContainer}>
                                                                <Image
                                                                    source={{ uri: restaurant.image || (restaurant.photos?.length > 0 ? restaurant.photos[0].url : "fallback-image-url") }}
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
                                                                <Text style={styles.placeCategory} numberOfLines={1}>⭐ {restaurant.rating || "N/A"}</Text>
                                                            </View>
                                                        </View>

                                                        {restaurantIndex < restaurants.length - 1 && (
                                                            <View style={styles.distanceContainer}>
                                                                {(() => {
                                                                    const currentRestaurant = restaurant.title || restaurant.name || "Unnamed Restaurant";
                                                                    const nextRestaurant = restaurants[restaurantIndex + 1]?.title || restaurants[restaurantIndex + 1]?.name || "Unnamed Restaurant";

                                                                    return (
                                                                        <>
                                                                            <Text style={styles.distanceText}> ⏱ {distances[`${currentRestaurant}-${nextRestaurant}`]?.distance || "N/A"}</Text>
                                                                            <Text style={styles.timeText}> 📏 {distances[`${currentRestaurant}-${nextRestaurant}`]?.duration || "N/A"}</Text>
                                                                        </>
                                                                    );
                                                                })()}

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
                    <TouchableOpacity style={styles.bottomSheetButton} onPress={() => handlePlaceAction(selectedItem, "website")}>
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
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={{ width: "100%", alignItems: 'center' }}
                        >
                            <View style={styles.reportModelContainer}>
                                <View style={{ padding: hp(1.8), borderTopRightRadius: wp(2), borderTopLeftRadius: wp(2), flexDirection: 'row', backgroundColor: COLORS.red, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.white }}>Share Itinerary</Text>
                                    </View>
                                    <TouchableOpacity onPress={toggelModel}>
                                        <Entypo name="cross" size={hp(3)} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>
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
                                    {/* Error Message (Visible only if emailError exists) */}
                                    {emailError ? (
                                        <Text style={{ color: "red", fontSize: hp(2), fontFamily: fontFamily.FONTS.Medium, marginTop: hp(1), marginLeft: wp(1) }}>
                                            {emailError}
                                        </Text>
                                    ) : null}

                                    <View style={{ flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: COLORS.red,
                                            borderRadius: wp(2),
                                            // padding: 3,
                                            height: hp(4.5),
                                            width: wp(30),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} onPress={handleShareItinerary}>
                                            {loading ? (
                                                <ActivityIndicator color={COLORS.white} size="large" />
                                            ) : (
                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.2), color: COLORS.white }}>Send</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
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
            <SVGS.ADDICON width={hp(3)} height={hp(3)} />
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
        backgroundColor: COLORS.red,
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
        color: COLORS.red,
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
        fontSize: hp(1.9)
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
        backgroundColor: "red",
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    placeImage: {
        width: wp(15),
        height: wp(15),
        borderRadius: wp(1.5),
        marginRight: wp(3),
    },
    placeDetails: {
        flex: 1,
    },
    placeTitle: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        paddingRight: wp(2.2),
    },
    placeAddress: {
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.Midgray,
        fontSize: hp(1.8)
    },
    placeCategory: {
        fontSize: hp(1.7),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
    },
    placePrice: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.red,
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
        marginTop: hp(2.2),
        width: wp(95),
        backgroundColor: COLORS.tertiaryWhite,
        borderRadius: wp(2.2)
    }

});

export default PlanTripDetails;