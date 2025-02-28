import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, SafeAreaView, StatusBar, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from '../../components/Button';

const SearchScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { category } = route.params;

    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedMarkers, setSelectedMarkers] = useState([]);

    // Dummy Data (Replace with API Data)
    const dummyData = {
        Hotel: [
            { name: 'Hotel Plaza', lat: 35.6895, lng: 139.6917, marker: require('../../../assets/icons/hotel_marker.png') },
            { name: 'Sunrise Resort', lat: 35.682839, lng: 139.759455, marker: require('../../../assets/icons/hotel_marker.png') },
        ],
        Activity: [
            { name: 'Hiking Tour', lat: 35.673261, lng: 139.570302, marker: require('../../../assets/icons/activity_marker.png') },
            { name: 'Museum Visit', lat: 35.690921, lng: 139.700257, marker: require('../../../assets/icons/activity_marker.png') },
        ],
        Restaurant: [
            { name: 'Italian Bistro', lat: 35.668368, lng: 139.600757, marker: require('../../../assets/icons/resturants_marker.png') },
            { name: 'Sushi Spot', lat: 35.699835, lng: 139.774195, marker: require('../../../assets/icons/resturants_marker.png') },
        ],
    };

    const handleSearch = () => {
        setResults(dummyData[category] || []);
    };

    const handleSelect = (item) => {
        setSelectedMarkers((prevMarkers) => [...prevMarkers, item]);
        console.log("Selected Markers:", selectedMarkers);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={hp(3)} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Add a {category} to the itinerary</Text>
                </View>

                <View style={{ marginTop: hp(2), marginHorizontal: wp(6) }}>
                    <Text style={styles.label}>Search for {category}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={`Search for a ${category}...`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                </View>

                {/* Map */}
                <MapView
                    key={selectedMarkers.length} // Forces re-render
                    provider="google"
                    style={styles.map}
                    initialRegion={{
                        latitude: 35.6895,
                        longitude: 139.6917,
                        latitudeDelta: 0.5,
                        longitudeDelta: 0.4,
                    }}
                >
                    {selectedMarkers.map((item, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: item.lat, longitude: item.lng }}
                            title={item.name}
                        >
                            <Image source={item.marker} style={styles.customMarker} />
                        </Marker>
                    ))}
                </MapView>

                {/* <FlatList
                    data={results}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
                            <Text style={styles.resultText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                /> */}

                <View style={styles.buttonContainer}>
                    <Button
                        title="Add into the list"
                        color={COLORS.red}
                        onPress={() => navigation.navigate("TabStack")}
                        style={styles.loginButton}
                    />
                </View>

            </View>
        </SafeAreaView>
    );
};

export default SearchScreen;


const styles = StyleSheet.create({
    container: { flex: 1, marginTop: hp(6.2), backgroundColor: COLORS.white },
    headerContainer: {
        paddingHorizontal: wp(3),
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: wp(2),
    },
    header: {
        fontSize: hp(2.2),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
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
        borderRadius: wp(2),
        height: hp(6),
        paddingHorizontal: wp(3),
        fontSize: wp(4),
        marginBottom: hp(2),
    },
    map: {
        width: '100%',
        height: hp(100),
        borderRadius: wp(2),
        marginBottom: hp(2),
    },
    customMarker: {
        width: wp(8),
        height: wp(8),
        resizeMode: "contain",
    },
    resultItem: {
        padding: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.red,
    },
    resultText: { fontSize: hp(2.2) },
    /* Fixed Bottom Button */
    buttonContainer: {
        position: "absolute",
        bottom: hp(4), // Position slightly above screen bottom
        width: "100%",
        paddingHorizontal: wp(6),
    },

});

