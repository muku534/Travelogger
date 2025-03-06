import React, { useEffect, useRef, useState, version } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Animated, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, fontFamily, SVGS } from '../../../constants';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import Toast from "react-native-toast-message";
import { createItineraries } from '../../services/planTripService';
import LinearGradient from 'react-native-linear-gradient';

const AiPlanTripDetails = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { destination, startDate, endDate, coordinates, tripDays } = useSelector(state => state.tripDetails);
    console.log("tripDays", tripDays);
    const [expanded, setExpanded] = useState(null);
    const [activeTab, setActiveTab] = useState('List');
    const sliderAnim = useRef(new Animated.Value(wp(12))).current; // Start at 'List' position
    const userData = useSelector(state => state.userData);
    const [loading, setLoading] = useState(false);
    const [distances, setDistances] = useState({});

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
        let speedMph = 50; // Default speed (Car travel)

        if (category === "Walking") speedMph = 3;
        if (category === "Biking") speedMph = 12;

        const durationHours = distance / speedMph;
        const durationMinutes = Math.round(durationHours * 60);

        return durationMinutes > 60
            ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
            : `${durationMinutes} min`;
    };

    useEffect(() => {
        calculateDistances();
    }, [tripDays]);

    // Function to calculate distances locally
    const calculateDistances = () => {
        let newDistances = {};

        for (let i = 0; i < tripDays.length; i++) {
            let places = [];

            // Handle both `items` and `sections` structures
            if (tripDays[i]?.items && Array.isArray(tripDays[i].items)) {
                places = tripDays[i].items;
            } else if (tripDays[i]?.sections) {
                places = [
                    ...(tripDays[i].sections.hotels || []),
                    ...(tripDays[i].sections.activities || []),
                    ...(tripDays[i].sections.restaurants || [])
                ];
            }

            if (!places || places.length < 2) continue;

            for (let j = 0; j < places.length - 1; j++) {
                // Extract coordinates, handling both data formats
                const getCoordinates = (place) => {
                    if (!place) return null;
                    if (place.coordinates) {
                        return { latitude: place.coordinates[0], longitude: place.coordinates[1] };
                    } else if (place.location?.coordinates) {
                        return { latitude: place.location.coordinates[0], longitude: place.location.coordinates[1] };
                    }
                    return null;
                };

                let origin = getCoordinates(places[j]);
                let destination = getCoordinates(places[j + 1]);
                let category = places[j]?.category || places[j]?.type;

                // Ensure we use either `name` or `title`
                const originName = places[j]?.name || places[j]?.title || "Unnamed Place";
                const destinationName = places[j + 1]?.name || places[j + 1]?.title || "Unnamed Place";

                if (!origin || !destination || !origin.latitude || !origin.longitude || !destination.latitude || !destination.longitude) {
                    console.warn(`Missing coordinates for ${originName} or ${destinationName}`);
                    continue;
                }

                const distanceMiles = haversineDistance(origin, destination);
                const durationText = estimateDuration(distanceMiles, category);

                console.log(`Distance from ${originName} to ${destinationName}: ${distanceMiles} miles, ${durationText}`);

                newDistances[`${originName}-${destinationName}`] = {
                    distance: `${distanceMiles} miles`,
                    duration: durationText,
                };
            }
        }

        setDistances(newDistances);
    };


    const handleSaveItinerary = async () => {
        console.log("Trip Details:", tripDays);

        try {
            setLoading(true);

            const itineraryData = {
                itinerary: {
                    userId: userData.userId,
                    title: `${destination} Trip ${new Date().getFullYear()}`,
                    status: "draft",
                    visibility: "private",
                    generatedBy: "AI",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    tripImg: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80",
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
                        date: new Date(day.date || day.day).toISOString().split("T")[0], // Support both formats
                        dayNumber: index + 1,
                        budget: { planned: 0, actual: 0 },

                        sections: {
                            hotels: (day.sections?.hotels || day.items?.filter(item => item.category === "Hotel") || []).map(hotel => ({
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
                                rating: hotel.rating || 0,
                                userRatingsTotal: hotel.userRatingsTotal || 0,
                                photos: hotel.photos && Array.isArray(hotel.photos)
                                    ? hotel.photos.map(photo => ({ url: photo.url, caption: photo.caption || null }))
                                    : hotel.image ? [{ url: hotel.image }] : [],
                                contact: {
                                    phone: hotel.contact?.phone || hotel.phone || "",
                                    email: hotel.contact?.email || "",
                                    website: hotel.contact?.website || hotel.website || "",
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

                            activities: (day.sections?.activities || day.items?.filter(item => item.category === "Activity") || []).map(activity => ({
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
                                rating: activity.rating || 0,
                                userRatingsTotal: activity.userRatingsTotal || 0,
                                photos: activity.photos && Array.isArray(activity.photos)
                                    ? activity.photos.map(photo => ({ url: photo.url, caption: photo.caption || null }))
                                    : activity.image ? [{ url: activity.image }] : [],
                                contact: {
                                    phone: activity.contact?.phone || activity.phone || "",
                                    email: activity.contact?.email || activity.email || "",
                                    website: activity.contact.website || activity.website || "",
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

                            restaurants: (day.sections?.restaurants || day.items?.filter(item => item.category === "Restaurant") || []).map(restaurant => ({
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
                                rating: restaurant.rating || 0,
                                userRatingsTotal: restaurant.userRatingsTotal || 0,
                                photos: restaurant.photos && Array.isArray(restaurant.photos)
                                    ? restaurant.photos.map(photo => ({ url: photo.url, caption: photo.caption || null }))
                                    : restaurant.image ? [{ url: restaurant.image }] : [],
                                contact: {
                                    phone: restaurant?.contact?.phone || restaurant.phone || "",
                                    email: restaurant?.contact?.email || restaurant.email || "",
                                    website: restaurant?.contact?.website || restaurant.website || "",
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

            console.log("Saving Itinerary:", itineraryData);

            // Uncomment when ready to save
            const response = await createItineraries(itineraryData);
            console.log("Itinerary Saved:", response);


            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Itinerary saved successfully!",
            });
            navigation.navigate("Aliternary");
        } catch (error) {
            console.error("Error saving itinerary:", error);

            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to save itinerary. Try again later.",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent backgroundColor="transparent" barStyle={activeTab === 'List' ? 'light-content' : 'dark-content'} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(2) }} >
                <View style={styles.container}>
                    {activeTab === 'List' ? (
                        <ImageBackground source={{ uri: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80" }} style={styles.headerImage}>
                            <View style={styles.overlay} />
                        </ImageBackground>
                    ) : (
                        <MapView
                            provider="google"
                            style={{ width: wp(100), height: hp(30) }}
                            initialRegion={{
                                latitude: coordinates?.[0] || 22.3193, // Default to Hong Kong
                                longitude: coordinates?.[1] || 114.1694,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1,
                            }}
                            onMapReady={() => console.log("Map Loaded")}
                            onError={(error) => console.log("Map Error: ", error)}
                        >
                            <Marker
                                coordinate={{
                                    latitude: coordinates?.[0] || 22.3193,
                                    longitude: coordinates?.[1] || 114.1694,
                                }}
                                title={destination}
                                description="Main Destination"
                            />
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
                                    <Text style={styles.budgetAmount}>$0.0</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(3), marginLeft: 'auto' }}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveItinerary} activeOpacity={0.5}>
                                    <SVGS.SAVE width={wp(5)} height={hp(2)} />
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ height: hp(3.5), width: wp(9), borderRadius: wp(2), marginLeft: wp(3), overflow: 'hidden' }}>
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
                                            <Text style={styles.dayTitle}>Day {index + 1}: {item.day}</Text>
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
                                            <OptionButton title="Add Hotel" Icon={SVGS.AIHOTEL} onPress={() => handleAddItem('Hotel', index)} />
                                            {hotels.map((hotel, hotelIndex) => (
                                                <View key={hotelIndex}>
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
                                                            <Text style={styles.placeCategory} numberOfLines={1}>⭐ {hotel.rating || "N/A"}</Text>
                                                        </View>
                                                        <Text style={styles.placePrice}>${hotel.price || 0}</Text>
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
                                            ))}

                                            {/* Activity Section */}
                                            <OptionButton title="Add Activities" Icon={SVGS.ACTIVITY} isImage={true} onPress={() => handleAddItem('Activity', index)} />
                                            {activities.map((activity, activityIndex) => (
                                                <View key={activityIndex}>
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
                                                            <Text style={styles.placeCategory} numberOfLines={1}>⭐ {activity.rating || "N/A"}</Text>
                                                        </View>
                                                        <Text style={styles.placePrice}>${activity.price || 0}</Text>
                                                    </View>

                                                    {activityIndex < activities.length - 1 && (
                                                        <View style={styles.distanceContainer}>
                                                            {(() => {
                                                                const currentActivityName = activity.name || activity.title || "Unnamed Activity";
                                                                const nextActivityName = activities[activityIndex + 1]?.name || activities[activityIndex + 1]?.title || "Unnamed Activity";
                                                                return (
                                                                    <>
                                                                        <Text style={styles.distanceText}>
                                                                            ⏱ {distances[`${currentActivityName}-${nextActivityName}`]?.distance || "N/A"}
                                                                        </Text>
                                                                        <Text style={styles.timeText}>
                                                                            📏 {distances[`${currentActivityName}-${nextActivityName}`]?.duration || "N/A"}
                                                                        </Text>
                                                                    </>
                                                                );
                                                            })()}
                                                            {/* <Text style={styles.distanceText}>{distances[`${activity.name}-${activities[activityIndex + 1]?.name}`]?.distance || "N/A"}</Text>
                                                            <Text style={styles.timeText}>{distances[`${activity.name}-${activities[activityIndex + 1]?.name}`]?.duration || "N/A"}</Text> */}
                                                        </View>
                                                    )}
                                                </View>
                                            ))}

                                            {/* Restaurant Section */}
                                            <OptionButton title="Add Restaurants" Icon={SVGS.RESTAURANTS} onPress={() => handleAddItem('Restaurant', index)} />
                                            {restaurants.map((restaurant, restaurantIndex) => (
                                                <View key={restaurantIndex}>
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
                                                            <Text style={styles.placeCategory} numberOfLines={1}>⭐ {restaurant.rating || "N/A"}</Text>
                                                        </View>
                                                        <Text style={styles.placePrice}>${restaurant.price || 0}</Text>
                                                    </View>

                                                    {restaurantIndex < restaurants.length - 1 && (
                                                        <View style={styles.distanceContainer}>
                                                            {(() => {
                                                                const currentRestaurantName = restaurant.name || restaurant.title || "Unnamed Restaurant";
                                                                const nextRestaurantName = restaurants[restaurantIndex + 1]?.name || restaurants[restaurantIndex + 1]?.title || "Unnamed Restaurant";
                                                                return (
                                                                    <>
                                                                        <Text style={styles.distanceText}>
                                                                            ⏱ {distances[`${currentRestaurantName}-${nextRestaurantName}`]?.distance || "N/A"}
                                                                        </Text>
                                                                        <Text style={styles.timeText}>
                                                                            📏 {distances[`${currentRestaurantName}-${nextRestaurantName}`]?.duration || "N/A"}
                                                                        </Text>
                                                                    </>
                                                                );
                                                            })()}
                                                            {/* <Text style={styles.distanceText}>{distances[`${restaurant.name}-${restaurants[restaurantIndex + 1]?.name}`]?.distance || "N/A"}</Text>
                                                            <Text style={styles.timeText}>{distances[`${restaurant.name}-${restaurants[restaurantIndex + 1]?.name}`]?.duration || "N/A"}</Text> */}
                                                        </View>
                                                    )}
                                                </View>
                                            ))}

                                        </View>
                                    )}
                                </View>
                            );
                        }}
                    />

                </View>
            </ScrollView>
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
        marginHorizontal: wp(5),
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
        marginHorizontal: wp(5),
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
        fontFamily: fontFamily.FONTS.Medium,
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
    placeCategory: {
        fontSize: hp(1.7),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
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
});

export default AiPlanTripDetails;
