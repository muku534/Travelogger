import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily, Images, SVGS } from "../../../constants";
import ItineraryCard from "../../components/ItineraryCard";
import BasicHeader from "../../components/BasicHealder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FETCH_ITINERARIES, SET_TRIP_DETAILS } from "../../redux/Actions";
import { getItineraries } from "../../services/planTripService";
import { useDispatch, useSelector } from "react-redux";

const AIIternary = ({ navigation }) => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData);
    const Itinerary = useSelector(state => state.Itineraries || []);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchItinerary = async () => {
        setLoading(true);
        try {
            const response = await getItineraries(userData.userId);

            if (response) {
                dispatch({
                    type: FETCH_ITINERARIES,
                    payload: { Itineraries: response },
                });
                console.log("this is the Itinerary", response)
            } else {
                logger.error("somthing went wrong to fetch the Itinerary")
            }
        } catch (error) {
            logger.error("somthing went wrong to fetch the Itinerary Error:", error)
        } finally {
            setLoading(false)
        }
    }

    // Pull-to-Refresh function
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchItinerary();
        setRefreshing(false);
    };


    useEffect(() => {
        fetchItinerary();
    }, []);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <View style={styles.container}>
                <BasicHeader />
                {/* Trip List */}
                <View style={{ flex: 1 }}>
                    {loading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={COLORS.red} />
                        </View>
                    ) : (
                        <FlatList
                            data={Itinerary.filter(itinerary => itinerary.generatedBy === "AI")}
                            keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
                            renderItem={({ item }) => (
                                <ItineraryCard
                                    item={item}
                                    onPress={() => {
                                        console.log("this is the item", item.days);

                                        const tripDays = item.days.map((day, index) => ({
                                            id: `day-${index + 1}`,
                                            day: new Date(day.date).toDateString(),
                                            items: [
                                                ...(day.sections?.activities || []).map(activity => ({
                                                    ...activity,
                                                    type: "activity",
                                                })),
                                                ...(day.sections?.hotels || []).map(hotel => ({
                                                    ...hotel,
                                                    type: "hotel",
                                                })),
                                                ...(day.sections?.restaurants || []).map(restaurant => ({
                                                    ...restaurant,
                                                    type: "restaurant",
                                                }))
                                            ] // Extracted and merged activities, hotels, and restaurants
                                        }));

                                        dispatch({
                                            type: SET_TRIP_DETAILS,
                                            payload: {
                                                tripDetails: {
                                                    destination: item.tripDetails?.destination.name,
                                                    startDate: item.tripDetails?.startDate,
                                                    endDate: item.tripDetails?.endDate,
                                                    coordinates: item.tripDetails?.destination?.coordinates,
                                                    tripDays: tripDays, // ✅ Transformed data
                                                }
                                            },
                                        });

                                        navigation.navigate("AiPlanTripDetails");
                                    }}

                                    showAIBadge={true} // ✅ Show AI badge only in AI itineraries
                                />
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <SVGS.ITINERARY width={hp(10)} height={hp(10)} />
                                    <Text style={styles.emptyText}>No itineraries found</Text>
                                    <Text style={styles.emptySubText}>Start planning your first trip now!</Text>
                                </View>
                            }
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            contentContainerStyle={{ paddingBottom: hp(13) }}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AIIternary;

const styles = {
    container: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        marginVertical: hp(30),
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        marginVertical: hp(30),
        alignItems: "center",
    },
    emptyText: {
        fontSize: hp(2.5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginTop: hp(1),
    },
    emptySubText: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.Midgray,
        textAlign: "center",
        marginTop: hp(1),
    },
};
