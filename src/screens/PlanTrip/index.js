import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, FlatList, Animated } from "react-native";
import DatePicker from "react-native-date-picker";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily, SVGS } from "../../../constants";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import usePlaceSearch from "../../hooks/usePlaceSearch";
import { SET_TRIP_DETAILS } from "../../redux/Actions";
import CommonHeader from "../../components/CommonHeader";
import Toast from "react-native-toast-message";

const PlanTrip = ({ navigation }) => {
  const dispatch = useDispatch();
  const { destination, suggestions, showSuggestions, selectedLocation, placeImages, handleDestinationChange, handlePlaceSelect } = usePlaceSearch();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const today = new Date(); // Get today's date

  const suggestionBoxRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(suggestionBoxRef, {
      toValue: showSuggestions ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showSuggestions]);

  // Handle Start Date Selection
  const handleStartDate = useCallback((date) => {
    setOpenStart(false);
    setStartDate(date);

    // Reset end date ONLY if it's invalid (before the new start date)
    setEndDate((prevEndDate) => (prevEndDate && prevEndDate > date ? prevEndDate : null));
  }, []);

  // Handle End Date Selection
  const handleEndDate = useCallback((date) => {
    setOpenEnd(false);

    if (!startDate) {
      Toast.show({
        type: "error",
        text1: "Select Start Date",
        text2: "Please select a start date first.",
      });
      return;
    }

    if (date <= startDate) {
      Toast.show({
        type: "error",
        text1: "Invalid Date",
        text2: "End date must be after the start date.",
      });
      return;
    }

    setEndDate(date);
  }, [startDate]);

  const handleContinue = () => {
    if (!destination.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Destination",
        text2: "Please enter a destination.",
      });
      return;
    }
    if (!startDate || !endDate) {
      Toast.show({
        type: "error",
        text1: "Date Selection",
        text2: "Please select both start and end dates.",
      });
      return;
    }

    // ✅ Generate tripDays dynamically before dispatching
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const generatedDays = Array.from({ length: numberOfDays }, (_, i) => {
      const newDate = new Date(start);
      newDate.setDate(start.getDate() + i);

      return {
        id: `day-${i + 1}`,
        day: newDate.toDateString(),
        items: [] // ✅ Start with an empty array
      };
    });

    // ✅ Now tripDays is properly initialized before dispatching
    dispatch({
      type: SET_TRIP_DETAILS,
      payload: {
        tripDetails: {
          id: null,
          destination: destination,
          tripImg: placeImages[0],
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          coordinates: selectedLocation,
          tripDays: generatedDays, // ✅ Pass the computed tripDays
        }
      },
    });

    navigation.navigate("PlanTripDetails", { fromPlanTrip: false });
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
      <CommonHeader title="Plan Your Trip" navigation={navigation} />
      <View style={styles.container}>
        {/* Destination Input */}
        <Text style={styles.label}>Destination</Text>
        <TextInput style={styles.input} placeholderTextColor={COLORS.Midgray} placeholder="Enter Destination" value={destination} onChangeText={handleDestinationChange} />

        {/* Suggestions List */}
        {showSuggestions && (
          <Animated.View style={[styles.suggestionBox, { opacity: suggestionBoxRef, zIndex: showSuggestions ? 2 : -1 }]}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionItem} onPress={() => handlePlaceSelect(item)}>
                  <Text style={styles.suggestionText}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        )}

        {/* Start Date */}
        <View style={{ zIndex: showSuggestions ? -1 : 1 }}>
          <Text style={styles.label}>Start Date</Text>
          <View style={styles.datePicker}>
            <Text style={{ color: COLORS.darkgray }}>
              {startDate ? startDate.toDateString() : "Select Date"}
            </Text>
            <TouchableOpacity onPress={() => setOpenStart(true)}>
              <SVGS.CALENDARICON width={wp(6)} height={hp(3)} />
            </TouchableOpacity>
          </View>
        </View>
        {/* ✅ Fix: Ensure `openStart` is triggered correctly */}
        {openStart && (
          <DatePicker
            modal
            open={openStart}
            date={startDate || today}
            mode="date"
            minimumDate={today}
            onConfirm={handleStartDate}
            onCancel={() => setOpenStart(false)}

          />
        )}

        {/* End Date */}
        <Text style={styles.label}>End Date</Text>
        <View style={styles.datePicker}>
          <Text style={{ color: COLORS.darkgray }}>
            {endDate ? endDate.toDateString() : "End Date"}
          </Text>
          <TouchableOpacity onPress={() => setOpenEnd(true)}>
            <SVGS.CALENDARICON width={wp(6)} height={hp(3)} />
          </TouchableOpacity>
        </View>
        {/* ✅ Fix: Ensure `openEnd` is triggered correctly */}
        {openEnd && (
          <DatePicker
            modal
            open={openEnd}
            date={endDate || new Date(today.getTime() + 24 * 60 * 60 * 1000)}
            mode="date"
            minimumDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date(today.getTime() + 24 * 60 * 60 * 1000)}
            onConfirm={handleEndDate}
            onCancel={() => setOpenEnd(false)}
          />
        )}

        {/* Continue Planning Button */}
        <Button
          title="Continue Planning"
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
};

export default PlanTrip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp(2),
    paddingHorizontal: wp(3),
    backgroundColor: COLORS.white,
  },
  label: {
    fontSize: hp(1.8),
    color: COLORS.darkgray,
    fontFamily: fontFamily.FONTS.bold,
    marginTop: hp(1),
  },
  input: {
    borderWidth: 0.5,
    borderColor: COLORS.Midgray,
    color: COLORS.darkgray,
    fontFamily: fontFamily.FONTS.Medium,
    borderRadius: wp(2),
    height: hp(6),
    paddingHorizontal: wp(3),
    fontSize: hp(1.8),
    marginBottom: hp(2),
  },
  suggestionBox: {
    position: "absolute",
    top: hp(10),
    left: wp(3),
    right: wp(3),
    backgroundColor: COLORS.white,
    borderRadius: wp(2),
    zIndex: 0.5,
    borderWidth: 0.7,
    borderColor: COLORS.gray,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    maxHeight: hp(25),
    overflow: "hidden"
  },
  suggestionItem: {
    padding: wp(2),
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1
  },
  suggestionText: {
    fontSize: hp(2),
    color: COLORS.darkgray,
    fontFamily: fontFamily.FONTS.bold
  },
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.5,
    height: hp(6),
    color: COLORS.darkgray,
    borderColor: COLORS.Midgray,
    borderRadius: wp(2),
    padding: hp(1.5),
    fontSize: wp(4),
    marginBottom: hp(2),
  },
  button: {
    width: wp(90),
    alignSelf: 'center',
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
