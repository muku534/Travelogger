import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import DatePicker from "react-native-date-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";
import fontFamily from "../../../constants/fontFamily";
import Calendar from "../../../assets/icons/calendar.svg";
import Button from "../../components/Button";

const PlanTrip = ({ navigation }) => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(new Date()); // ✅ Ensure default value
  const [endDate, setEndDate] = useState(new Date()); // ✅ Ensure default value
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={wp(6)} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Plan Your Trip</Text>
        </View>

        {/* Destination Input */}
        <Text style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter here"
          value={destination}
          onChangeText={setDestination}
        />

        {/* Start Date */}
        <Text style={styles.label}>Start Date</Text>
        <View style={styles.datePicker}>
          <Text style={{ color: "black" }}>
            {startDate ? startDate.toDateString() : "Select Date"}
          </Text>
          <TouchableOpacity onPress={() => setOpenStart(true)}>
            <Calendar width={wp(6)} height={hp(3)} />
          </TouchableOpacity>
        </View>
        {/* ✅ Fix: Ensure `openStart` is triggered correctly */}
        {openStart && (
          <DatePicker
            modal
            open={openStart}
            date={startDate}
            mode="date"
            onConfirm={(date) => {
              setOpenStart(false);
              setStartDate(date);
            }}
            onCancel={() => setOpenStart(false)}
          />
        )}

        {/* End Date */}
        <Text style={styles.label}>End Date</Text>
        <View style={styles.datePicker}>
          <Text style={{ color: "black" }}>
            {endDate ? endDate.toDateString() : "End Date"}
          </Text>
          <TouchableOpacity onPress={() => setOpenEnd(true)}>
            <Calendar width={wp(6)} height={hp(3)} />
          </TouchableOpacity>
        </View>
        {/* ✅ Fix: Ensure `openEnd` is triggered correctly */}
        {openEnd && (
          <DatePicker
            modal
            open={openEnd}
            date={endDate}
            mode="date"
            onConfirm={(date) => {
              setOpenEnd(false);
              setEndDate(date);
            }}
            onCancel={() => setOpenEnd(false)}
          />
        )}

        {/* Continue Planning Button */}
        <Button
          title="Continue Planning"
          color={COLORS.red}
          onPress={() => navigation.navigate("PlanTripDetails")}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

export default PlanTrip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp(6.2),
    paddingHorizontal: wp(3),
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    marginBottom: hp(3),
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: wp(2), // Add spacing from title
  },
  header: {
    fontSize: wp(5),
    color: COLORS.darkgray,
    fontFamily: fontFamily.FONTS.bold,
  },
  label: {
    fontSize: wp(4),
    color: COLORS.darkgray,
    fontFamily: fontFamily.FONTS.bold,
    marginBottom: hp(1),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.Midgray,
    borderRadius: wp(2),
    padding: hp(1.5),
    height: hp(6),
    fontSize: wp(4),
    marginBottom: hp(2),
  },
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    height: hp(6),
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
