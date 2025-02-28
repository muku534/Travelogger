import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
import PlanYourTripIcon from '../../../assets/icons/planyourtrip.svg';
import CreateWithAIIcon from '../../../assets/icons/createwithai.svg';
import SearchIcon from '../../../assets/icons/search.svg';  // Replace with actual file path
import BellIcon from '../../../assets/icons/notification.svg';      // Replace with actual file path 
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const heroData = [
    { id: '1', image: require('../../../assets/images/BGHome.png'), title: 'Plan your Trip with us', subtitle: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: '2', image: require('../../../assets/images/Bali.png'), title: 'Explore the World', subtitle: 'Discover amazing places with us.' },
    { id: '3', image: require('../../../assets/images/Turkey.png'), title: 'Your Adventure Awaits', subtitle: 'Book your next trip now!' },
];

const featureData = [
    { id: '1', IconComponent: PlanYourTripIcon, title: 'Plan your Trip' },
    { id: '2', IconComponent: CreateWithAIIcon, title: 'Create with AI' },
];

const placeCategories = [
    {
        title: 'Top Visited Places', data: [
            { id: '2', image: require('../../../assets/images/usa.png'), title: 'USA' },
            { id: '3', image: require('../../../assets/images/Thailand.png'), title: 'Thailand' },
            { id: '4', image: require('../../../assets/images/Turkey.png'), title: 'Turkey' },
        ]
    },
    {
        title: 'Rated Places for you', data: [
            { id: '5', image: require('../../../assets/images/Canada.png'), title: 'Canada' },
            { id: '6', image: require('../../../assets/images/Bristol.png'), title: 'Bristol' },
            { id: '7', image: require('../../../assets/images/Turkey.png'), title: 'Paris' },
        ]
    }
];

const Main = () => {
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />

            {/* 🔴 Fixed Header */}
            <View style={styles.header}>
                <Image source={require('../../../assets/images/travelogger_logo.png')} style={styles.logo} />

                <View style={styles.headerIcons}>
                    <TouchableOpacity>
                        <SearchIcon width={wp(8.5)} height={hp(4)} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <BellIcon width={wp(8.5)} height={hp(4)} style={styles.notificationIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(13.5) }}>

                {/* Hero Section - Swipeable */}
                <Carousel
                    width={screenWidth}
                    height={hp(32)}
                    data={heroData}
                    scrollAnimationDuration={800}
                    onSnapToItem={(index) => setActiveHeroIndex(index)}
                    renderItem={({ item }) => (
                        <View style={styles.heroContainer}>
                            <Image source={item.image} style={styles.heroImage} />
                            <View style={styles.heroTextContainer}>
                                <Text style={styles.heroTitle}>{item.title}</Text>
                                <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
                            </View>
                        </View>
                    )}
                />
                <View style={styles.paginationContainer}>
                    {heroData.map((_, index) => (
                        <View key={index} style={[styles.paginationDot, activeHeroIndex === index && styles.activeDot]} />
                    ))}
                </View>

                {/* Feature Section */}
                <View style={styles.featureContainer}>
                    {featureData.map((item) => {
                        const IconComponent = item.IconComponent;
                        return (
                            <LinearGradient
                                key={item.id}
                                colors={['#FEF2F2', '#FFD1D1']} // Gradient Colors
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }} // Left to Right Gradient
                                style={styles.featureCard}
                            >
                                <Text style={styles.featureText}>{item.title}</Text>
                                <IconComponent width={wp(13)} height={wp(13)} />
                            </LinearGradient>
                        );
                    })}
                </View>


                {/* Famous Places for You - Carousel */}
                <View>
                    <Text style={styles.sectionTitle}>Famous Places for you</Text>
                    <Carousel
                        width={wp(100)} // Adjusted width for better spacing
                        height={hp(19)} // Adjusted height
                        mode="parallax"
                        modeConfig={{
                            parallaxScrollingScale: 0.95, // 🔥 Slightly reduced scale for better side visibility
                            parallaxAdjacentItemScale: 0.89, // 🔥 Adjusted to better match the reference
                        }}
                        pagingEnabled={true}
                        snapEnabled={true}
                        data={placeCategories[0].data}
                        scrollAnimationDuration={700} // Slightly faster scroll
                        renderItem={({ item }) => (
                            <View style={styles.famousCard}>
                                <ImageBackground source={item.image} style={styles.famousplaceImage}>
                                    {/* Overlay Image */}
                                    <Image source={require('../../../assets/images/overlay.png')} style={styles.overlayImage} />
                                    <View style={styles.overlay} />
                                    <Text style={styles.famousplaceText}>{item.title}</Text>
                                </ImageBackground>
                            </View>
                        )}
                    />
                </View>


                {/* Categories */}
                {placeCategories.map((category, index) => (
                    <View key={index}>
                        <Text style={styles.sectionTitle}>{category.title}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {category.data.map((place) => (
                                <View key={place.id} style={styles.placeCard}>
                                    <Image source={place.image} style={styles.placeImage} />
                                    <Text style={styles.placeText}>{place.title}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        marginTop: hp(5),
        paddingBottom: hp(1),
        backgroundColor: COLORS.white,
    },
    logo: {
        height: hp(4),
        width: wp(35),
        resizeMode: 'contain',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationIcon: {
        marginLeft: wp(2),
    },
    heroContainer: {
        position: 'relative',
        overlayColor: 'rgba(0,0,0,0.3)',
    },
    heroImage: {
        width: '100%',
        height: hp(31),
        resizeMode: 'cover'
    },
    heroTextContainer: {
        position: 'absolute',
        bottom: hp(2),
        left: wp(3),
        right: wp(4)
    },
    heroTitle: {
        fontSize: wp(5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.white
    },
    heroSubtitle: {
        fontSize: wp(4),
        color: COLORS.white,
        marginTop: hp(0.5)
    },
    // Feature Section
    featureContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: wp(2),
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp(45),  // Adjusted for spacing
        height: hp(7),   // Increased height for better visibility
        borderRadius: wp(3),
        paddingHorizontal: wp(3),
        borderWidth: 0.4,
        borderColor: COLORS.gray,
        overflow: 'hidden', // Ensures rounded corners
    },

    featureText: {
        fontSize: wp(4),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.black,
        flex: 1,
    },

    featureIcon: {
        width: wp(10),
        height: wp(10),
        resizeMode: 'contain',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: hp(1)
    },
    paginationDot: {
        width: wp(2),
        height: wp(2),
        borderRadius: wp(1),
        backgroundColor: COLORS.gray,
        marginHorizontal: wp(1)
    },
    activeDot: {
        backgroundColor: COLORS.red,
        width: wp(2.5),
        height: wp(2.5)
    },
    sectionTitle: {
        fontSize: wp(4.3),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        marginHorizontal: wp(4),
        marginVertical: hp(1)
    },
    placeCard: {
        marginHorizontal: wp(1.5),
        alignItems: 'center'
    },
    placeImage: {
        width: wp(30.5),
        height: wp(30.5),
        borderRadius: wp(3)
    },
    placeText: {
        marginTop: hp(1),
        fontSize: wp(4),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold
    },
    famousCard: {
        width: wp(78), // Reduced slightly to fit spacing
        height: hp(19),
        borderRadius: 0,
        overflow: 'hidden',
        alignSelf: 'center',
        marginHorizontal: wp(2), // 🔥 Adds spacing between items
        borderRadius: wp(2),
    },
    overlayImage: {
        position: 'absolute',
        width: '100%',
        height: '100%', // Covers entire hero image
        resizeMode: 'cover',
    },
    famousplaceImage: {
        width: '100%',
        height: '100%', // Adjusted height for better visibility
        resizeMode: 'cover',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        borderRadius: wp(2),
    },

    famousplaceText: {
        padding: hp(1.5), // Adjusted padding for better spacing
        fontSize: wp(4.5), // Increased font size slightly
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
});

