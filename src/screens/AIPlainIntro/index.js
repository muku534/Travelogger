import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS } from '../../../constants';
import OptionsSVG from '../../../assets/icons/Personalized.svg';
import BulbSVG from '../../../assets/icons/Smart.svg';
import FlashSVG from '../../../assets/icons/Instant.svg';
import fontFamily from '../../../constants/fontFamily';

const AIPlainIntro = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../../assets/images/aibg.png')}
        style={styles.background}
      >

        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={wp(8)} color="white" />
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
            colors={["#5100E6", "#008075"]}
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
    icon: <OptionsSVG width={wp(11)} height={wp(11)} />,
    title: 'Personalized Planning',
    description: 'Let our Advanced AI create personalized travel itineraries tailored to your interests and preferences.',
  },
  {
    icon: <BulbSVG width={wp(11)} height={wp(11)} />,
    title: 'Smart Suggestions',
    description: 'Discover hidden gems and local favorites at your destination.',
  },
  {
    icon: <FlashSVG width={wp(11)} height={wp(11)} />,
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
    marginTop: hp(8), // Adjusted top margin
  },
  backButton: {
    position: 'absolute',
    top: hp(0),
    left: wp(3),
  },
  title: {
    marginTop: hp(8), // Adjusted top margin
    fontSize: wp(6.5),
    lineHeight: wp(9),
    fontFamily: fontFamily.FONTS.bold,
    color: '#14E6CF',
    marginBottom: hp(1),
    paddingLeft: wp(2), // Adjusted left padding
  },
  highlight: {
    fontFamily: fontFamily.FONTS.bold,
    color: '#14E6CF',
  },
  subtitle: {
    fontSize: wp(3.5),
    lineHeight: wp(6.5),
    color: COLORS.white,
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
    fontSize: wp(4.5),
    fontFamily: fontFamily.FONTS.bold,
    paddingBottom: hp(0.7),
    lineHeight: wp(6),
    color: COLORS.white,
  },
  featureDescription: {
    lineHeight: wp(5),
    fontSize: wp(3.5),
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
    fontSize: wp(4.5),
    fontFamily: fontFamily.FONTS.Medium,
  },
});
