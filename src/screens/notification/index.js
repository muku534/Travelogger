import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList, StatusBar } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, fontFamily } from '../../../constants';
import CommonHeader from '../../components/CommonHeader';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";

// Sample travel-related notifications
const notificationsData = [
    {
        id: '1',
        title: 'Flight Reminder',
        message: 'Your flight to Paris (AF123) departs in 3 hours. Check-in now!',
        timestamp: 'Just now',
        type: 'flight',
        isRead: false,
    },
    {
        id: '2',
        title: 'Hotel Booking Confirmed',
        message: 'Your stay at Grand Hilton Paris is confirmed from March 10 - March 15.',
        timestamp: '1 hour ago',
        type: 'hotel',
        isRead: false,
    },
    {
        id: '3',
        title: 'Weather Alert',
        message: 'Heavy rain expected tomorrow in London. Carry an umbrella!',
        timestamp: '3 hours ago',
        type: 'alert',
        isRead: true,
    },
    {
        id: '4',
        title: 'Trip Reminder',
        message: 'Your Thailand trip starts in 2 days. Check your itinerary for details.',
        timestamp: 'Yesterday',
        type: 'trip',
        isRead: false,
    },
    {
        id: '5',
        title: 'New Travel Deals',
        message: 'Flash sale: 30% off flights to Bali! Offer valid till midnight.',
        timestamp: '2 days ago',
        type: 'offer',
        isRead: true,
    },
];

const Notification = ({ navigation }) => {
    const [notifications, setNotifications] = useState(notificationsData);

    // Function to mark notification as read
    const markAsRead = (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, isRead: true } : notification
            )
        );
    };

    // Function to dynamically determine the icon based on notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'flight':
                return 'airplane';
            case 'hotel':
                return 'bed';
            case 'alert':
                return 'weather-lightning-rainy';
            case 'trip':
                return 'map-marker-radius';
            case 'offer':
                return 'tag';
            default:
                return 'bell-outline'; // Default fallback icon
        }
    };

    // Function to render each notification item
    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.notificationCard, item.isRead && styles.readNotification]}
            activeOpacity={0.7}
            onPress={() => markAsRead(item.id)}
        >
            <View style={styles.notificationIconContainer}>
                <MaterialCommunityIcons
                    name={getNotificationIcon(item.type)}
                    size={hp(3.4)}
                    color={COLORS.Midgray}
                />
            </View>
            <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.screenContainer}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <CommonHeader title="Notifications" navigation={navigation} />

            {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="bell-off-outline" size={hp(8)} color={COLORS.gray} />
                    <Text style={styles.emptyText}>No Notifications</Text>
                    <Text style={styles.emptySubText}>You're all caught up!</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.notificationList}
                />
            )}
        </SafeAreaView>
    );
};

export default Notification;

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    notificationList: {
        paddingBottom: hp(2),
        marginVertical: hp(2)
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.LavenderBlush,
        height: hp(12),
        width: wp(100),
        marginVertical: hp(0.2),
        padding: wp(2.5),
        alignItems: 'center',
    },
    readNotification: {
        backgroundColor: COLORS.tertiaryWhite, // Lighter background for read notifications
    },
    notificationIconContainer: {
        width: hp(5),
        height: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: hp(2.5),
        marginRight: wp(4),
    },
    notificationTextContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: hp(2.1),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },
    notificationMessage: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray1,
        marginVertical: hp(0.5),
    },
    notificationTimestamp: {
        fontSize: hp(1.7),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.secondaryGray,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: COLORS.gray,
        textAlign: "center",
        marginTop: hp(0.5),
    },
});
