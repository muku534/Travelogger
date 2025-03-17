import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily, SVGS } from "../../../constants";
import ItineraryCard from "../../components/ItineraryCard";
import BasicHeader from "../../components/BasicHealder";
import { FETCH_ITINERARIES, SET_TRIP_DETAILS } from "../../redux/Actions";
import { getItineraries } from "../../services/planTripService";
import { useDispatch, useSelector } from "react-redux";
import logger from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid'

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
                const sortedItineraries = response.sort((a, b) =>
                    new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
                );
                dispatch({
                    type: FETCH_ITINERARIES,
                    payload: { Itineraries: sortedItineraries },
                });
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
                            data={[...Itinerary]
                                .filter(itinerary => itinerary.generatedBy === "AI")
                                .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                            }
                            keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
                            renderItem={({ item }) => (
                                <ItineraryCard
                                    item={item}
                                    onPress={() => {

                                        const tripDays = item.days.map((day, index) => ({
                                            id: `day-${index + 1}`,
                                            day: day.date,
                                            items: [
                                                ...(day.sections?.activities).map(activity => ({
                                                    ...activity,
                                                    type: "activity",
                                                    id: activity.id || uuidv4(),
                                                })),
                                                ...(day.sections?.hotels).map(hotel => ({
                                                    ...hotel,
                                                    type: "hotel",
                                                    id: hotel.id || uuidv4(),
                                                })),
                                                ...(day.sections?.restaurants).map(restaurant => ({
                                                    ...restaurant,
                                                    type: "restaurant",
                                                    id: restaurant.id || uuidv4(),
                                                }))
                                            ] // Extracted and merged activities, hotels, and restaurants
                                        }));

                                        dispatch({
                                            type: SET_TRIP_DETAILS,
                                            payload: {
                                                tripDetails: {
                                                    itineraryId: item.id,
                                                    tripImg: item.tripImg,
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
