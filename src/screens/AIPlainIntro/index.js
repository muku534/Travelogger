import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS, fontFamily, Images, SVGS } from '../../../constants';
import { Platform } from 'react-native';


const AIPlainIntro = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={Images.aibg}
        resizeMode="cover"
        style={styles.background}
      >

        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={wp(8)} color={COLORS.white} />
          </TouchableOpacity>

          {/* Heading */}
          <Text style={styles.title}>
            <Text style={styles.bold}>Discover Your Next{"\n"}Adventure with</Text>
            {"\n"}
            <Text style={styles.highlight}>AI Powered Travel Planning</Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Lets our Advanced AI Create personalized Travel
            itineraries tailored to your interesrs,preferences and
            Travel style. Experience smarter travel planning
          </Text>

          {/* Features */}
          {features.map((item, index) => (
            <View key={index} style={styles.feature}>
              <View>
                {item.icon}
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Custom Gradient Button (Placed at Bottom) */}
        <TouchableOpacity onPress={() => navigation.navigate("AIPlainTrip")} activeOpacity={0.8} style={styles.buttonContainer}>
          <LinearGradient
            colors={[COLORS.RoyalBlueViolet, COLORS.DeepTeal]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started with AI</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ImageBackground>
    </SafeAreaView>
  );
};

export default AIPlainIntro;

// Features Data
const features = [
  {
    icon: <SVGS.OPTIONS width={wp(11)} height={wp(11)} />,
    title: 'Personalized Planning',
    description: 'Let our Advanced AI create personalized travel itineraries tailored to your interests and preferences.',
  },
  {
    icon: <SVGS.BULB width={wp(11)} height={wp(11)} />,
    title: 'Smart Suggestions',
    description: 'Discover hidden gems and local favorites at your destination.',
  },
  {
    icon: <SVGS.FLASH width={wp(11)} height={wp(11)} />,
    title: 'Instant Itineraries',
    description: 'Generate complete travel plans in seconds.',
  },
];

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(3),
    justifyContent: 'flex-start', // Move text slightly up
    marginTop: Platform.OS === "ios" ? hp(0) : hp(8), // Adjusted top margin
  },
  backButton: {
    position: 'absolute',
    top: hp(0),
    left: wp(3),
  },
  title: {
    marginTop: hp(8), // Adjusted top margin
    fontSize: hp(2.8),
    lineHeight: wp(9),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.TiffanyBlue,
    marginBottom: hp(1),
    paddingLeft: wp(2), // Adjusted left padding
  },
  highlight: {
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.TiffanyBlue,
  },
  subtitle: {
    fontSize: hp(1.6),
    lineHeight: hp(2.5),
    color: COLORS.white,
    fontFamily: fontFamily.FONTS.Medium,
    marginBottom: hp(3),
    paddingLeft: wp(2), // Matching left alignment
  },
  feature: {
    marginHorizontal: wp(2), // Adjusted horizontal margin
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  featureText: {
    marginLeft: wp(4),
    flex: 1,
  },
  featureTitle: {
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.bold,
    paddingBottom: hp(0.7),
    lineHeight: wp(6),
    color: COLORS.white,
  },
  featureDescription: {
    lineHeight: hp(2.5),
    fontSize: hp(1.5),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.secondaryWhite,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp(7), // Moves button to bottom
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    height: hp(6), // Increase button height
    justifyContent: 'center',
    width: '100%',
    borderRadius: wp(2), // More rounded corners
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.Medium,
  },
});
