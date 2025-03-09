import React, { useCallback, useRef, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, SafeAreaView, StatusBar, Animated, FlatList } from "react-native";
import DatePicker from "react-native-date-picker";
import LinearGradient from "react-native-linear-gradient";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily, Images, SVGS } from "../../../constants";
import CommonHeader from "../../components/CommonHeader"; // Adjust the path as needed
import { createAIItineraries } from "../../services/AiPlanTripService";
import { useDispatch, useSelector } from "react-redux";
import Toast from 'react-native-toast-message';
import usePlaceSearch from "../../hooks/usePlaceSearch";
import LoadingScreen from "../../components/LoadingScreen";
import { SET_TRIP_DETAILS } from "../../redux/Actions";
import logger from '../../utils/logger'

const AIPlanTrip = ({ navigation }) => {
    const { destination, suggestions, showSuggestions, selectedLocation, handleDestinationChange, handlePlaceSelect } = usePlaceSearch();
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [selectedTravelType, setSelectedTravelType] = useState(null);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [selectedCuisine, setSelectedCuisine] = useState([]);
    const [loading, setLoading] = useState(false);

    const today = new Date(); // Get today's date

    const suggestionBoxRef = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(suggestionBoxRef, {
            toValue: showSuggestions ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [showSuggestions]);

    // Handle Start Date Selection
    const handleStartDate = useCallback((date) => {
        setOpenStartDate(false);
        setStartDate(date);

        // Reset end date ONLY if it's invalid (before the new start date)
        setEndDate((prevEndDate) => (prevEndDate && prevEndDate > date ? prevEndDate : null));
    }, []);

    // Handle End Date Selection
    const handleEndDate = useCallback((date) => {
        setOpenEndDate(false);

        if (!startDate) {
            Toast.show({
                type: "info",
                text1: "Select Start Date",
                text2: "Please select a start date first.",
            });
            return;
        }

        if (date <= startDate) {
            Toast.show({
                type: "error",
                text1: "Invalid Date",
                text2: "End date must be after the start date.",
            });
            return;
        }

        setEndDate(date);
    }, [startDate]);


    const toggleCuisineSelection = (name) => {
        setSelectedCuisine((prev) => {
            if (prev.includes(name)) {
                return prev.filter((cuisine) => cuisine !== name); // Remove if already selected
            }
            if (prev.length < 3) {
                return [...prev, name]; // Add if under limit (3 selections)
            }
            return prev;
        });
    };

    const handleGenerateTrip = async () => {
        if (!destination || !startDate || !endDate || !selectedTravelType || !selectedBudget) {
            Toast.show({
                type: "error",
                text1: "Missing Fields",
                text2: "Please fill in all required fields before generating the itinerary.",
            });
            return;
        }

        const itineraryData = {
            location: destination,
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
            travelers: selectedTravelType,
            budget: selectedBudget,
            coordinates: selectedLocation,
            cuisines: Array.isArray(selectedCuisine) ? selectedCuisine : [selectedCuisine],
        };


        try {
            setLoading(true); // Show loading indicator

            const response = await createAIItineraries(itineraryData);

            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Itinerary generated successfully!",
            });

            setLoading(false); // Hide loading

            // Ensure tripDays is formatted correctly
            const tripDays = response.days.map((day, index) => ({
                id: `day-${index + 1}`,
                day: new Date(day.date).toDateString(),
                dayNumber: day.dayNumber,
                budget: day.budget,
                sections: {
                    hotels: day.sections?.hotels || [],
                    activities: day.sections?.activities || [],
                    restaurants: day.sections?.restaurants || [],
                }
            }));

            // Dispatch to Redux Store
            dispatch({
                type: SET_TRIP_DETAILS,
                payload: {
                    tripDetails: {
                        itineraryId: null,
                        destination: response.tripDetails?.destination?.name || "",
                        startDate: response.tripDetails?.startDate || "",
                        endDate: response.tripDetails?.endDate || "",
                        coordinates: response.tripDetails?.destination?.coordinates || null,
                        tripDays: tripDays, // Now correctly formatted
                    },
                },
            });

            // Delay navigation slightly to ensure Redux state updates first
            setTimeout(() => {
                navigation.navigate("AiPlanTripDetails", { tripDetails: response });
            }, 300);

        } catch (error) {
            logger.error("Error generating itinerary:", error?.response || error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error?.response?.data?.message || "Something went wrong while generating the itinerary.",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            {loading ? (
                < LoadingScreen />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(5) }} >
                    <CommonHeader title="Plan your Perfect Trip" navigation={navigation} />
                    <View style={styles.container}>

                        {/* Destination Input */}
                        <Text style={styles.label}>Destination</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Destination"
                            placeholderTextColor={COLORS.Midgray}
                            value={destination}
                            onChangeText={handleDestinationChange} />

                        {/* Suggestions List */}
                        {showSuggestions && (
                            <Animated.View style={[styles.suggestionBox, { opacity: suggestionBoxRef, zIndex: showSuggestions ? 2 : -1 }]}>
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

                        {/* Start Date Picker */}
                        <View style={{ zIndex: showSuggestions ? -1 : 1 }}>
                            <Text style={styles.label}>Start Date</Text>
                            <View style={styles.dateInput}>
                                <Text style={styles.dateText}>
                                    {startDate ? startDate.toDateString() : "Select Start Date"}
                                </Text>
                                <TouchableOpacity onPress={() => setOpenStartDate(true)}>
                                    <SVGS.CALENDAR width={wp(6)} height={hp(6)} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {openStartDate && (
                            <DatePicker
                                modal
                                open={openStartDate}
                                date={startDate || today}
                                mode="date"
                                minimumDate={today}
                                onConfirm={handleStartDate}
                                onCancel={() => setOpenStartDate(false)}
                            />
                        )}

                        {/* End Date Picker */}
                        <Text style={styles.label}>End Date</Text>
                        <View style={styles.dateInput}>
                            <Text style={styles.dateText}>
                                {endDate ? endDate.toDateString() : "Select End Date"}
                            </Text>
                            <TouchableOpacity onPress={() => setOpenEndDate(true)}>
                                <SVGS.CALENDAR width={wp(6)} height={hp(6)} />
                            </TouchableOpacity>
                        </View>
                        {openEndDate && (
                            <DatePicker
                                modal
                                open={openEndDate}
                                date={endDate || new Date(today.getTime() + 24 * 60 * 60 * 1000)}
                                mode="date"
                                minimumDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date(today.getTime() + 24 * 60 * 60 * 1000)}
                                onConfirm={handleEndDate}
                                onCancel={() => setOpenEndDate(false)}
                            />
                        )}

                        {/* Who is Traveling Section */}
                        <Text style={styles.sectionTitle}>Who is Travelling</Text>
                        <View style={styles.optionsContainer}>
                            {[
                                { name: "Solo", icon: <SVGS.SOLO width={wp(10)} height={hp(5)} /> },
                                { name: "Couple", icon: <SVGS.COUPLE width={wp(10)} height={hp(5)} /> },
                                { name: "Family/Group", icon: <SVGS.GROUP width={wp(10)} height={hp(5)} /> },
                            ].map((item, index) => (
                                <TouchableOpacity key={index}
                                    onPress={() => setSelectedTravelType(item.name)}
                                    style={[
                                        styles.option,
                                        selectedTravelType === item.name && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                                    ]}>
                                    {item.icon}
                                    <Text style={styles.optionText}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Budget Range */}
                        <Text style={styles.sectionTitle}>What is your Budget Range</Text>
                        <View style={styles.optionsContainer}>
                            {[
                                { name: "Budget", subtitle: "Under $100/day", icon: <SVGS.BUDGET width={wp(10)} height={hp(5)} /> },
                                { name: "Moderate", subtitle: "Under $200-$300/day", icon: <SVGS.MODERATE width={wp(10)} height={hp(5)} /> },
                                { name: "Luxury", subtitle: "Over $300/day", icon: <SVGS.LUXURY width={wp(10)} height={hp(5)} /> },
                            ].map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => setSelectedBudget(item.name)}
                                    style={[
                                        styles.option,
                                        selectedBudget === item.name && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                                    ]}>
                                    {item.icon}
                                    <Text style={styles.optionText}>{item.name}</Text>
                                    <Text style={styles.optionSubText}>{item.subtitle}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Cuisine Preferences */}
                        <Text style={styles.sectionTitle}>Select your Preferred Cuisines</Text>
                        <Text style={styles.sectionSubTitle}>optional Choose Upto 3</Text>
                        <View style={styles.optionsContainer}>
                            {[
                                { name: "Italian", icon: <SVGS.ITALIAN width={wp(10)} height={hp(5)} /> },
                                { name: "Japanese", icon: <SVGS.JAPANESE width={wp(10)} height={hp(5)} /> },
                                { name: "Mexican", icon: <SVGS.MEXICAN width={wp(10)} height={hp(5)} /> },
                                { name: "Asian", icon: <SVGS.ASIAN width={wp(10)} height={hp(5)} /> },
                                { name: "Local", icon: <SVGS.LOCAL width={wp(10)} height={hp(5)} /> },
                                { name: "Healthy", icon: <SVGS.HEALTHY width={wp(10)} height={hp(5)} /> },
                            ].map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => toggleCuisineSelection(item.name)}
                                    style={[
                                        styles.option,
                                        selectedCuisine.includes(item.name) && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                                    ]}>
                                    {item.icon}
                                    <Text style={styles.optionText}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Popular Destinations */}
                        <Text style={styles.sectionTitle}>Popular Destinations</Text>
                        <View style={styles.destinationsContainer}>
                            {[
                                { name: "Bali", img: Images.bali },
                                { name: "Thailand", img: Images.thailand },
                                { name: "Turkey", img: Images.turkey },
                            ].map((dest, index) => (
                                <View key={index} style={styles.destination}>
                                    <Image source={dest.img} style={styles.destinationImage} />
                                    <Text style={styles.destinationText}>{dest.name}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Generate Trip Button */}
                        <TouchableOpacity style={styles.button} onPress={handleGenerateTrip}>
                            <LinearGradient
                                colors={[COLORS.RoyalBlueViolet, COLORS.DeepTeal]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.buttonText}>Generate a Trip</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default AIPlanTrip;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: hp(2),
        paddingHorizontal: wp(3),
        backgroundColor: COLORS.white,
    },
    label: {
        fontSize: hp(1.8),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        marginBottom: hp(1),
    },
    input: {
        borderWidth: 0.5,
        borderColor: COLORS.Midgray,
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
        borderRadius: wp(2),
        height: hp(6),
        paddingHorizontal: wp(3),
        fontSize: hp(1.8),
        marginBottom: hp(2),
    },
    suggestionBox: {
        position: "absolute",
        top: hp(9),
        left: wp(3),
        right: wp(3),
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
    dateInput: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: COLORS.Midgray,
        borderRadius: wp(2),
        height: hp(6),
        paddingHorizontal: wp(3),
        fontSize: hp(1.8),
        marginBottom: hp(2),
    },
    dateText: {
        color: COLORS.darkgray,
    },
    sectionTitle: {
        fontSize: hp(2),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        marginBottom: hp(0.9),
    },
    sectionSubTitle: {
        fontSize: hp(2),
        color: COLORS.Midgray,
        fontFamily: fontFamily.FONTS.Medium,
        marginBottom: hp(1),
    },
    optionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: hp(1),
    },
    option: {
        width: wp(29), // Ensuring uniform width
        height: hp(14), // Ensuring uniform height
        borderColor: COLORS.PaleBlue,
        borderWidth: 1,
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp(1),
    },

    optionText: {
        textAlign: "center",
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(1.7),
        marginTop: hp(1),
    },
    optionSubText: {
        fontSize: hp(1.3),
        color: COLORS.Midgray,
        fontFamily: fontFamily.FONTS.Medium,
        paddingVertical: hp(0.5),
    },
    destinationsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    destination: {
        width: "30%",
        alignItems: "center",
    },
    destinationImage: {
        width: wp(29),
        height: hp(13),
        resizeMode: 'contain',
        borderRadius: wp(4),
    },
    destinationText: {
        marginTop: hp(1),
        fontSize: hp(1.8),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
    },
    button: {
        marginTop: hp(3),
        alignSelf: "center",
    },
    gradientButton: {
        width: wp(92),
        paddingVertical: hp(2),
        borderRadius: wp(2),
        alignItems: "center",
    },
    buttonText: {
        color: COLORS.white,
        fontSize: hp(2.1),
        fontFamily: fontFamily.FONTS.bold
    },
});

