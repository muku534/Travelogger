import React, { useEffect, useState } from 'react';
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
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS, Images, SVGS } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
import PlanYourTripIcon from '../../../assets/icons/planyourtrip.svg';
import CreateWithAIIcon from '../../../assets/icons/createwithai.svg';
import LinearGradient from 'react-native-linear-gradient';
import { retrieveDataFromAsyncStorage } from '../../utils/Helper';
import { useSelector } from 'react-redux';
import BasicHeader from '../../components/BasicHealder';

const { width: screenWidth } = Dimensions.get('window');

const heroData = [
    { id: '1', image: Images.bgHome, title: 'Plan your Trip with us', subtitle: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: '2', image: Images.bali, title: 'Explore the World', subtitle: 'Discover amazing places with us.' },
    { id: '3', image: Images.turkey, title: 'Your Adventure Awaits', subtitle: 'Book your next trip now!' },
];

const featureData = [
    { id: '1', IconComponent: PlanYourTripIcon, title: 'Plan your Trip' },
    { id: '2', IconComponent: CreateWithAIIcon, title: 'Create with AI' },
];

const placeCategories = [
    {
        title: 'Top Visited Places',
        data: [
            { id: '2', image: Images.usa, title: 'New York', blogUrl: 'https://www.makemytrip.com/tripideas/places/new-york' },
            { id: '3', image: Images.thailand, title: 'Las Vegas', blogUrl: 'https://www.makemytrip.com/tripideas/places/las-vegas' },
            { id: '4', image: Images.turkey, title: 'Miami', blogUrl: 'https://www.makemytrip.com/tripideas/places/miami' },
        ]
    },
    {
        title: 'Rated Places for you',
        data: [
            { id: '5', image: Images.canada, title: 'San Francisco', blogUrl: 'https://www.makemytrip.com/tripideas/places/san-francisco' },
            { id: '6', image: Images.bristol, title: 'Washington D.C.', blogUrl: 'https://www.makemytrip.com/tripideas/places/washington' },
            { id: '7', image: Images.turkey, title: 'Chicago', blogUrl: 'https://www.makemytrip.com/tripideas/places/chicago' },
        ]
    }
];

const Main = ({ navigation }) => {
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const userData = useSelector(state => state.userData);

    // Function to navigate to the BlogScreen with the blog URL
    const handlePlacePress = (blogUrl) => {
        navigation.navigate('BlogScreen', { blogUrl });
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            {/* Header */}
            <BasicHeader />

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
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    if (item.title === "Plan your Trip") {
                                        navigation.navigate("PlanTrip");
                                    } else if (item.title === "Create with AI") {
                                        navigation.navigate("AIPlainTrip");
                                    }
                                }}
                                activeOpacity={0.7}
                            >
                                <LinearGradient
                                    colors={[COLORS.LavenderBlush, COLORS.LightCoral]} // Gradient Colors
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }} // Left to Right Gradient
                                    style={styles.featureCard}
                                >
                                    <Text style={styles.featureText}>{item.title}</Text>
                                    <IconComponent width={wp(13)} height={wp(13)} />
                                </LinearGradient>
                            </TouchableOpacity>
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
                            <TouchableOpacity onPress={() => handlePlacePress(item.blogUrl)} style={styles.famousCard} activeOpacity={0.7} >
                                <ImageBackground source={item.image} style={styles.famousplaceImage}>
                                    {/* Overlay Image */}
                                    <Image source={Images.overlay} style={styles.overlayImage} />
                                    <View style={styles.overlay} />
                                    <Text style={styles.famousplaceText}>{item.title}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                    />
                </View>


                {/* Categories */}
                {placeCategories.map((category, index) => (
                    <View key={index}>
                        <Text style={styles.sectionTitle}>{category.title}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {category.data.map((place) => (
                                <TouchableOpacity key={place.id} onPress={() => handlePlacePress(place.blogUrl)} style={styles.placeCard} activeOpacity={0.7} >
                                    <Image source={place.image} style={styles.placeImage} />
                                    <Text style={styles.placeText}>{place.title}</Text>
                                </TouchableOpacity>
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
        fontSize: hp(2.2),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.white
    },
    heroSubtitle: {
        fontSize: hp(1.8),
        color: COLORS.white,
        fontFamily: fontFamily.FONTS.Medium,
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
        fontSize: hp(1.9),
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
        fontSize: hp(2),
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
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.white,
        textAlign: 'center',
    },
});