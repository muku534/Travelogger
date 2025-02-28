import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../components/Pixel/Index';
// Import SVG Icons
import HomeIcon from '../../assets/icons/Home.svg';
import HomeActiveIcon from '../../assets/icons/Home_Active.svg';
import ProfilIcon from '../../assets/icons/Profile_icon_deactive.svg';
import ProfileActiveIcon from '../../assets/icons/Profile.svg';
import AITripIcon from '../../assets/icons/AiTrip.svg';
import AIIcon from '../../assets/icons/AI_icon_deactive.svg';
import AIActiveIcon from '../../assets/icons/AI_icon.svg';
import PlanTrip from '../../assets/icons/plan_trip.svg';
import MyItineraryIcon from '../../assets/icons/Itinerary.svg';
import MyItineraryActiveIcon from '../../assets/icons/Itinerary_Active.svg';
import PlusIcon from '../../assets/icons/plus.svg';
import CloseIcon from '../../assets/icons/Add.svg';
import fontFamily from '../../constants/fontFamily';
import LinearGradient from 'react-native-linear-gradient';
import { AIIternary, Home, MyIternary, Profile } from '../screens';

const Tab = createBottomTabNavigator();

const FloatingActionButton = () => {
    const navigation = useNavigation();
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        if (isOpen) {
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
            setIsOpen(false);
        }
    };

    const button1TranslateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -hp(9)],
    });

    const button2TranslateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -hp(17)],
    });

    return (
        <>
            {/* Overlay only covers screen ABOVE the bottom navigation */}
            {isOpen && <Pressable style={styles.overlay} onPress={closeMenu} />}

            <View style={styles.floatingContainer}>
                {/* Button 2 */}
                <Animated.View style={[styles.floatingButton, { transform: [{ translateY: button2TranslateY }] }]}>
                    <LinearGradient
                        colors={["#5100E6", "#008075"]} // Gradient Colors
                        start={{ x: 0, y: 0 }} // Left
                        end={{ x: 1, y: 0 }}   // Right
                        style={[styles.actionButton]}
                    >
                        <TouchableOpacity

                            onPress={() => {
                                closeMenu();
                                navigation.navigate("AIPlainIntro");
                            }}
                            activeOpacity={0.7}
                        >
                            <AITripIcon width={hp(3.5)} height={hp(3.5)} />
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>


                {/* Button 1 */}
                <Animated.View style={[styles.floatingButton, { transform: [{ translateY: button1TranslateY }] }]}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: COLORS.red }]}
                        onPress={() => {
                            closeMenu();
                            navigation.navigate("PlanTrip");
                        }}
                        activeOpacity={0.7}
                    >
                        <PlanTrip width={hp(3.5)} height={hp(3.5)} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Main Floating Button */}
                <TouchableOpacity
                    onPress={toggleMenu}
                    style={[
                        styles.centerButton,
                        { backgroundColor: isOpen ? COLORS.tertiaryWhite : COLORS.red }
                    ]}
                >
                    {isOpen ? (
                        <CloseIcon width={hp(6)} height={hp(6)} fill={COLORS.red} />
                    ) : (
                        <PlusIcon width={hp(4)} height={hp(4)} fill={COLORS.white} />
                    )}
                </TouchableOpacity>
            </View>
        </>
    );
};

const TabStack = () => {
    return (

        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarShowLabel: true,
                lazy: false,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: {
                    fontSize: hp(1.4),
                    paddingTop: hp(0.7),
                    fontFamily: fontFamily.FONTS.Medium,
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    width: wp(20),
                    lineHeight: hp(1.8),
                },
                tabBarActiveTintColor: COLORS.red,
                tabBarInactiveTintColor: COLORS.darkgray,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        focused ? <HomeActiveIcon width={hp(3.3)} height={hp(3.3)} />
                            : <HomeIcon width={hp(3.3)} height={hp(3.3)} />
                    ),
                    tabBarLabel: "Home",  // ✅ Show label
                }}
            />

            <Tab.Screen
                name="MyIternary"
                component={MyIternary}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        focused ? <MyItineraryActiveIcon width={hp(3.3)} height={hp(3.3)} />
                            : <MyItineraryIcon width={hp(3.3)} height={hp(3.3)} />
                    ),
                    tabBarLabel: "My Itinerary",  // ✅ Show label
                }}
            />

            <Tab.Screen
                name="Add"
                component={() => null}
                options={{
                    tabBarButton: () => <FloatingActionButton />,
                }}
            />

            <Tab.Screen
                name="AIIternary"
                component={AIIternary}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        focused ? <AIActiveIcon width={hp(3.3)} height={hp(3.3)} />
                            : <AIIcon width={hp(3.3)} height={hp(3.3)} />
                    ),
                    tabBarLabel: "AI Itinerary",  // ✅ Show label
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        focused ? <ProfileActiveIcon width={hp(3.3)} height={hp(3.3)} />
                            : <ProfilIcon width={hp(3.3)} height={hp(3.3)} />
                    ),
                    tabBarLabel: "Profile",  // ✅ Show label
                }}
            />
        </Tab.Navigator>

    );
};

export default TabStack;

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        backgroundColor: 'white',
        paddingBottom: hp(1), // Increase padding to prevent text cut-off
        paddingTop: hp(1),
        paddingHorizontal: wp(2),
        width: '100%',
        height: hp(10), // Increased height
        borderColor: COLORS.gray,
        borderWidth: 0.5
    },
    floatingContainer: {
        position: 'absolute',
        bottom: hp(5),
        alignSelf: 'center',
        alignItems: 'center',
    },
    floatingButton: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
    },
    centerButton: {
        width: hp(6.5),
        height: hp(6.5),
        borderRadius: hp(6.5),
        backgroundColor: '#EB4034',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        width: hp(6.2),
        height: hp(6.2),
        marginBottom: hp(2),
        borderRadius: hp(6.2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: hp(9), // Stops at the bottom navigation bar
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent dark overlay
    },
});
