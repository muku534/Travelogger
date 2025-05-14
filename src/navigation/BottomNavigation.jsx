import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import { COLORS, fontFamily, SVGS } from '../../constants';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../components/Pixel/Index';
import LinearGradient from 'react-native-linear-gradient';

import { AIIternary, Home, MyIternary, Profile } from '../screens';

const Tab = createBottomTabNavigator();
const isTablet = DeviceInfo.isTablet();

const FloatingActionButton = ({ isOpen, toggleMenu, animation, closeMenu }) => {
    const navigation = useNavigation();

    const button1TranslateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -hp(9)],
    });

    const button2TranslateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -hp(17)],
    });

    return (
        <View style={styles.floatingContainer}>
            <Animated.View
                style={[styles.floatingButton, { transform: [{ translateY: button2TranslateY }] }]} >
                <TouchableOpacity
                    onPress={() => {
                        closeMenu();
                        navigation.navigate("AIPlainIntro");
                    }}
                    activeOpacity={0.7}
                    style={{ width: "100%", height: "100%" }}
                >
                    <LinearGradient
                        colors={[COLORS.RoyalBlueViolet, COLORS.DeepTeal]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.actionButton]}
                    >
                        <SVGS.AITRIPEICON width={hp(3.5)} height={hp(3.5)} />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View
                style={[styles.floatingButton, { transform: [{ translateY: button1TranslateY }] }]} >
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: COLORS.red }]}
                    onPress={() => {
                        closeMenu();
                        navigation.navigate("PlanTrip");
                    }}
                    activeOpacity={0.7}
                >
                    <SVGS.PLANTRIP width={hp(3.5)} height={hp(3.5)} />
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
                onPress={toggleMenu}
                style={[
                    styles.centerButton,
                    { backgroundColor: isOpen ? COLORS.tertiaryWhite : COLORS.red },
                ]}
            >
                {isOpen ? (
                    <SVGS.CLOSEICON width={hp(6)} height={hp(6)} fill={COLORS.red} />
                ) : (
                    <SVGS.PLUSICON width={hp(4)} height={hp(4)} fill={COLORS.white} />
                )}
            </TouchableOpacity>
        </View>
    );
};

const TabStack = () => {
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

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

    // 👇 Close the menu when any tab is selected
    useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            closeMenu();
        });
        return unsubscribe;
    }, [navigation, isOpen]);

    return (
        <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={{ flex: 1 }}>
                <Tab.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        tabBarShowLabel: true,
                        lazy: false,
                        tabBarStyle: styles.tabBar,
                        tabBarLabelStyle: {
                            fontSize: isTablet ? hp(1.8) : hp(1.4),
                            paddingTop: hp(0.7),
                            fontFamily: fontFamily.FONTS.Medium,
                            textAlign: 'center',
                            flexWrap: 'wrap',
                            width: isTablet ? wp(15) : wp(20),
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
                            tabBarIcon: ({ focused }) =>
                                focused ? <SVGS.HOMEACTIVEICON width={hp(3.3)} height={hp(3.3)} /> :
                                    <SVGS.HOMEICON width={hp(3.3)} height={hp(3.3)} />,
                            tabBarLabel: "Home",
                        }}
                    />

                    <Tab.Screen
                        name="MyIternary"
                        component={MyIternary}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ focused }) =>
                                focused ? <SVGS.MYITINERARYACTIVEICON width={hp(3.3)} height={hp(3.3)} /> :
                                    <SVGS.MYITINERARYICON width={hp(3.3)} height={hp(3.3)} />,
                            tabBarLabel: "My Itinerary",
                        }}
                    />

                    <Tab.Screen
                        name="Add"
                        component={View}
                        options={{
                            tabBarButton: () => (
                                <FloatingActionButton
                                    isOpen={isOpen}
                                    toggleMenu={toggleMenu}
                                    animation={animation}
                                    closeMenu={closeMenu}
                                />
                            ),
                        }}
                    />

                    <Tab.Screen
                        name="AIIternary"
                        component={AIIternary}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ focused }) =>
                                focused ? <SVGS.AIACTIVEICON width={hp(3.3)} height={hp(3.3)} /> :
                                    <SVGS.AIICON width={hp(3.3)} height={hp(3.3)} />,
                            tabBarLabel: "AI Itinerary",
                        }}
                    />

                    <Tab.Screen
                        name="Profile"
                        component={Profile}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ focused }) =>
                                focused ? <SVGS.PROFILE width={hp(3.3)} height={hp(3.3)} /> :
                                    <SVGS.PROFILEICON width={hp(3.3)} height={hp(3.3)} />,
                            tabBarLabel: "Profile",
                        }}
                    />
                </Tab.Navigator>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default TabStack;

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: hp(3),
        left: wp(5),
        right: wp(5),
        elevation: 5,
        height: hp(8),
        borderRadius: wp(10),
        paddingBottom: isTablet ? hp(0.5) : hp(1),
        paddingTop: isTablet ? hp(0.5) : hp(1),
        paddingHorizontal: wp(2),
        borderTopWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    floatingContainer: {
        position: 'absolute',
        bottom: hp(3.5),
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
});
