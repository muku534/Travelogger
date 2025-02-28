import React, { useRef, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Animated, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constants';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import fontFamily from '../../../constants/fontFamily';
import Share from "../../../assets/icons/sharebg_icon.svg";
import Save from "../../../assets/icons/bookmark.svg";
import Budget from "../../../assets/icons/total budget_icon.svg";
import Calendar from "../../../assets/icons/calendarai_icon.svg";
import Hotel from '../../../assets/icons/hotelai_icon.svg';
import Activity from '../../../assets/icons/Activitiesai_icon.png';
import Restaurants from '../../../assets/icons/Restaurantsai_icon.svg';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker } from 'react-native-maps';

const tripData = [
    {
        day: '18 Feb 25',
        items: [
            { id: '1', title: 'Royal Park Iconic', category: 'Hotel', price: '$200', rating: 3.6, image: require('../../../assets/images/Bali.png') },
            { id: '2', title: 'Senso-ji Temple', category: 'Activity', price: '$50', rating: 3.6, image: require('../../../assets/images/Bristol.png') },
            { id: '3', title: 'Tofu Ukai', category: 'Restaurant', price: '$100', rating: 3.6, image: require('../../../assets/images/Canada.png') },
        ]
    },
    {
        day: '19 Feb 25',
        items: [
            { id: '4', title: 'Shinjuku Hotel', category: 'Hotel', price: '$150', rating: 4.2, image: require('../../../assets/images/Turkey.png') },
            { id: '5', title: 'Tokyo Tower Tour', category: 'Activity', price: '$70', rating: 4.5, image: require('../../../assets/images/Thailand.png') },
            { id: '6', title: 'Sushi Zanmai', category: 'Restaurant', price: '$120', rating: 4.8, image: require('../../../assets/images/usa.png') },
        ]
    }
];


const AiPlanTripDetails = ({ navigation }) => {
    const [expanded, setExpanded] = useState(null);
    const [activeTab, setActiveTab] = useState('List');
    const sliderAnim = useRef(new Animated.Value(wp(12))).current; // Start at 'List' position

    const handleToggle = (tab) => {
        setActiveTab(tab);
        Animated.timing(sliderAnim, {
            toValue: tab === 'List' ? wp(12) : 0, // Adjust for button width
            duration: 300,
            useNativeDriver: false,
        }).start();
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent backgroundColor="transparent" barStyle={activeTab === 'List' ? 'light-content' : 'dark-content'} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(2) }} >
                <View style={styles.container}>
                    {/* Header Image with Overlay */}
                    {/* Background Image OR Map */}
                    {activeTab === 'List' ? (
                        <ImageBackground source={require('../../../assets/images/Turkey.png')} style={styles.headerImage}>
                            <View style={styles.overlay} />
                        </ImageBackground>
                    ) : (
                        <MapView
                            provider="google" // Use Google Maps
                            style={{ width: wp(100), height: hp(30) }}
                            initialRegion={{
                                latitude: 35.6895,
                                longitude: 139.6917,
                                latitudeDelta: 0.5,
                                longitudeDelta: 0.4,
                            }}
                            onMapReady={() => console.log("Map Loaded")}
                            onError={(error) => console.log("Map Error: ", error)}
                        >
                            <Marker coordinate={{ latitude: 35.6895, longitude: 139.6917 }} title="Tokyo" />
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
                                colors={['#5100E6', '#008075']}
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
                        <Text style={styles.title}>Plan Your Tokyo Trip</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Calendar width={wp(4)} height={hp(2)} />
                            <Text style={styles.date}> 18/2/25 - 19/2/2025</Text>
                        </View>
                        <Text style={styles.description}>Plan your Trip day by day. Add Hotels, Restaurants, and Activities to create a Perfect Itinerary</Text>
                        <View style={styles.budgetContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Budget width={wp(5)} height={hp(4)} />
                                <View style={{ paddingHorizontal: wp(1) }}>
                                    <Text style={styles.budgetText}>Total Budget</Text>
                                    <Text style={styles.budgetAmount}>$0.0</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(3), marginLeft: 'auto' }}>
                                <TouchableOpacity style={styles.saveButton} activeOpacity={0.5}>
                                    <Save width={wp(5)} height={hp(2)} />
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ height: hp(3.5), width: wp(9), borderRadius: wp(2), marginLeft: wp(3), overflow: 'hidden' }}>
                                    <LinearGradient
                                        colors={['#5100E6', '#008075']}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                        style={StyleSheet.absoluteFill}
                                    />
                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                        <Share width={wp(5)} height={hp(3)} />
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                    <FlatList
                        data={tripData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            const hotel = item.items.find((place) => place.category === "Hotel");
                            const activity = item.items.find((place) => place.category === "Activity");
                            const restaurant = item.items.find((place) => place.category === "Restaurant");

                            return (
                                <View style={styles.dayContainer}>
                                    <TouchableOpacity onPress={() => setExpanded(expanded === index ? null : index)} style={styles.dayHeader}>
                                        <View>
                                            <Text style={styles.dayTitle}>Day {index + 1}: {item.day}</Text>
                                            <Text style={{ color: COLORS.darkgray, fontSize: hp(1.7), fontFamily: fontFamily.FONTS.Medium }}>
                                                0 items <Text style={{ color: '#4A0ADD', fontFamily: fontFamily.FONTS.Medium, fontSize: hp(1.7) }}> $0.00</Text>
                                            </Text>
                                        </View>
                                        <Ionicons name={expanded === index ? 'chevron-up' : 'chevron-down'} size={wp(5)} color={COLORS.black} />
                                    </TouchableOpacity>

                                    {expanded === index && (
                                        <View style={styles.optionsContainer}>
                                            {/* Hotel Option and Item */}
                                            <OptionButton title="Add Hotel" Icon={Hotel} />
                                            {hotel && (
                                                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('SearchScreen', { category: 'Hotel' })}>
                                                    <View style={styles.placeContainer}>
                                                        <Image source={hotel.image} style={styles.placeImage} />
                                                        <View style={styles.placeDetails}>
                                                            <Text style={styles.placeTitle}>{hotel.title}</Text>
                                                            <Text style={styles.placeCategory}>{hotel.category} • ⭐ {hotel.rating}</Text>
                                                        </View>
                                                        <Text style={styles.placePrice}>{hotel.price}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}

                                            {/* Activity Option and Item */}
                                            <OptionButton title="Add Activities" Icon={Activity} isImage={true} />
                                            {activity && (
                                                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('SearchScreen', { category: 'Activity' })} >
                                                    <View style={styles.placeContainer}>
                                                        <Image source={activity.image} style={styles.placeImage} />
                                                        <View style={styles.placeDetails}>
                                                            <Text style={styles.placeTitle}>{activity.title}</Text>
                                                            <Text style={styles.placeCategory}>{activity.category} • ⭐ {activity.rating}</Text>
                                                        </View>
                                                        <Text style={styles.placePrice}>{activity.price}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}

                                            {/* Restaurant Option and Item */}
                                            <OptionButton title="Add Restaurants" Icon={Restaurants} />
                                            {restaurant && (
                                                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('SearchScreen', { category: 'Restaurant' })}>
                                                    <View style={styles.placeContainer}>
                                                        <Image source={restaurant.image} style={styles.placeImage} />
                                                        <View style={styles.placeDetails}>
                                                            <Text style={styles.placeTitle}>{restaurant.title}</Text>
                                                            <Text style={styles.placeCategory}>{restaurant.category} • ⭐ {restaurant.rating}</Text>
                                                        </View>
                                                        <Text style={styles.placePrice}>{restaurant.price}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
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
        <TouchableOpacity activeOpacity={0.7}>
            <Text style={{ color: '#4A0ADD', fontFamily: fontFamily.FONTS.Medium, fontSize: hp(1.7) }}>$200</Text>
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
        color: '#4A0ADD',
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
        padding: wp(3),
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
    },
    placeCategory: {
        fontSize: hp(1.7),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
    },
    placePrice: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.bold,
        color: '#4A0ADD',
    },

});

export default AiPlanTripDetails;
