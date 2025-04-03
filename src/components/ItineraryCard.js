import React, { useRef } from "react";
import { View, Text, Image, TouchableOpacity, Alert, Linking } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "./Pixel/Index";
import { COLORS, fontFamily, SVGS } from "../../constants";
import LinearGradient from "react-native-linear-gradient";
import RBSheet from "react-native-raw-bottom-sheet";
import { deleteItineraryById } from "../services/planTripService";
import { useDispatch } from "react-redux";
import { DELETE_ITINERARY } from "../redux/Actions";
import Toast from 'react-native-toast-message';
import FastImage from "react-native-fast-image";

const currencySymbols = {
    USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥",
    AUD: "A$", CAD: "C$", CNY: "¥", KRW: "₩", MXN: "Mex$",
    BRL: "R$", ZAR: "R", RUB: "₽", CHF: "CHF", SEK: "kr", NZD: "NZ$",
};

const ItineraryCard = ({ item, onPress, showAIBadge = false, }) => {
    const refRBSheet = useRef(null); // Bottom Sheet Ref
    const dispatch = useDispatch();

    const openWebsite = () => {
        refRBSheet.current.close(); // Close BottomSheet first

        setTimeout(() => {
            const websiteUrl = 'https://www.travelogger.info';  // Get website URL

            if (websiteUrl) {
                Linking.openURL(websiteUrl).catch((err) => {
                    console.error("Failed to open URL:", err);
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Unable to open the website.",
                    });
                });
            } else {
                Toast.show({
                    type: "error",
                    text1: "No Website",
                    text2: "This itinerary has no website linked.",
                });
            }
        }, 300); // Delay to ensure bottom sheet closes smoothly
    };

    const openMapLocation = () => {
        refRBSheet.current.close(); // Close BottomSheet first

        setTimeout(() => {
            if (!item?.tripDetails?.destination?.coordinates) {
                Toast.show({
                    type: "error",
                    text1: "No Location",
                    text2: "Coordinates not available for this destination.",
                });
                return;
            }

            let latitude, longitude;
            const { coordinates } = item.tripDetails.destination;

            if (Array.isArray(coordinates)) {
                [latitude, longitude] = coordinates;
            } else {
                latitude = coordinates?.latitude;
                longitude = coordinates?.longitude;
            }

            if (latitude !== undefined && longitude !== undefined) {
                const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                Linking.openURL(url).catch(err => {
                    console.error("Failed to open map:", err);
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Unable to open map.",
                    });
                });
            } else {
                Toast.show({
                    type: "error",
                    text1: "No Location",
                    text2: "Invalid coordinates provided.",
                });
            }
        }, 300);
    };

    const openDirections = () => {
        refRBSheet.current.close(); // Close BottomSheet first

        setTimeout(() => {
            if (!item?.tripDetails?.destination?.coordinates) {
                Toast.show({
                    type: "error",
                    text1: "No Location",
                    text2: "Coordinates not available for this destination.",
                });
                return;
            }

            let latitude, longitude;
            const { coordinates } = item.tripDetails.destination;

            if (Array.isArray(coordinates)) {
                [latitude, longitude] = coordinates;
            } else {
                latitude = coordinates?.latitude;
                longitude = coordinates?.longitude;
            }

            if (latitude !== undefined && longitude !== undefined) {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
                Linking.openURL(url).catch(err => {
                    console.error("Failed to open directions:", err);
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Unable to open directions.",
                    });
                });
            } else {
                Toast.show({
                    type: "error",
                    text1: "No Location",
                    text2: "Invalid coordinates provided.",
                });
            }
        }, 300);
    };

    // Function to handle deletion
    const handleDelete = async () => {
        refRBSheet.current.close(); // Close BottomSheet before deletion

        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this itinerary?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteItineraryById(item.id); // Call API to delete
                            Toast.show({
                                type: "success",
                                text1: "Success",
                                text2: "Itinerary deleted successfully!",
                            });
                            dispatch({ type: DELETE_ITINERARY, payload: item.id }); // Update Redux Store
                        } catch (error) {
                            Toast.show({
                                type: "error",
                                text1: "Error",
                                text2: "Failed to delete itinerary. Please try again.",
                            });
                        }
                    },
                },
            ]
        );
    };

    // Extract budget and currency
    const currencyCode = item?.tripDetails?.budget?.currency || "USD"; // Default to USD
    const currencySymbol = currencySymbols[currencyCode] || currencyCode; // Fallback to currency code if not mapped
    const totalBudget = item?.tripDetails?.budget?.total || 0.0;



    return (
        <View>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <View style={styles.card}>
                    {/* Card Image */}
                    <FastImage source={{
                        uri: item?.tripImg,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable,
                    }} style={styles.cardImage} resizeMode={FastImage.resizeMode.cover} />

                    {/* Card Content */}
                    <View style={styles.cardContent}>
                        {/* Location */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons name="location-outline" size={hp(2)} style={{ paddingRight: wp(1) }} color={COLORS.Midgray} />
                            <Text style={styles.cardLocation} numberOfLines={1}>
                                {item?.tripDetails?.destination?.name || "No Destination"}
                            </Text>
                        </View>

                        {/* Trip Title */}
                        <Text style={styles.cardTitle} numberOfLines={1}>{item?.title || "Untitled Trip"}</Text>

                        {/* Trip Dates */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons name="calendar-outline" size={hp(2)} style={{ paddingRight: wp(1) }} color={COLORS.Midgray} />
                            <Text style={styles.cardDate} numberOfLines={1}>
                                {item?.tripDetails?.startDate || "N/A"} - {item?.tripDetails?.endDate || "N/A"}
                            </Text>
                        </View>

                        {/* Budget */}
                        <Text style={styles.cardPrice} numberOfLines={1}> {currencySymbol} {totalBudget.toFixed(2)}</Text>
                    </View>

                    {/* More Icon + AI Badge (if enabled) */}
                    <View style={styles.moreContainer}>
                        <TouchableOpacity style={styles.moreButton} onPress={() => refRBSheet.current.open()}>
                            <SVGS.MORE width={wp(6)} height={wp(6)} />
                        </TouchableOpacity>

                        {showAIBadge && (
                            <LinearGradient
                                colors={[COLORS.RoyalBlueViolet, COLORS.DeepTeal]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientIconContainer}
                            >
                                <SVGS.AITRIPEICON width={hp(2.5)} height={hp(2.5)} />
                            </LinearGradient>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {/* Bottom Sheet */}
            <RBSheet
                ref={refRBSheet}
                height={hp(10.5)}
                openDuration={250}
                closeOnPressBack={true}
                closeOnDragDown={true}
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
                    <TouchableOpacity style={styles.bottomSheetButton} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={wp(6)} color={COLORS.red} />
                        <Text style={[styles.bottomSheetText, { color: COLORS.red }]}>Delete from the List</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </View>
    );
};

export default ItineraryCard;

const styles = {
    card: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderColor: "#DAC6FF",
        borderWidth: 0.7,
        borderRadius: wp(3),
        marginHorizontal: wp(3),
        marginVertical: hp(1),
    },
    cardImage: {
        width: wp(28),
        height: "100%",
        resizeMode: "cover",
        borderTopLeftRadius: wp(3),
        borderBottomLeftRadius: wp(3),
    },
    cardContent: {
        flex: 1,
        padding: wp(3),
    },
    cardLocation: {
        fontSize: hp(1.8),
        color: COLORS.darkgray1,
        fontFamily: fontFamily.FONTS.Medium,
    },
    cardTitle: {
        fontSize: hp(2.1),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        paddingBottom: hp(0.1)
    },
    cardDate: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray1,
        paddingBottom: hp(0.1)
    },
    cardPrice: {
        fontSize: hp(1.9),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },
    moreContainer: {
        alignItems: "center",
        padding: wp(2),
        justifyContent: "space-between",
    },
    moreButton: {
        padding: wp(2),
        marginBottom: hp(1),
    },
    gradientIconContainer: {
        width: wp(8),  // Adjust as needed
        height: wp(8), // Adjust as needed
        borderRadius: wp(4), // Make it circular
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",  // Ensures gradient doesn't leak
    },
    bottomSheetButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp(1.5),
    },
    bottomSheetText: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        marginLeft: wp(3),
    },
};
