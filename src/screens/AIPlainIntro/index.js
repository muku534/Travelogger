import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS, fontFamily, Images, SVGS } from '../../../constants';
import DeviceInfo from 'react-native-device-info';
import { useSelector } from 'react-redux';

const isTablet = DeviceInfo.isTablet();

const AIPlainIntro = ({ navigation }) => {
  const userData = useSelector(state => state.userData);
  const isGuest = !userData || Object.keys(userData).length === 0;
 
  return (
    <View style={styles.rootContainer}>
      {/* Transparent Status Bar */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {isGuest ? (
            <View style={styles.guestContainer}>
                <Text style={styles.guestTitle}>You're browsing as a guest</Text>
                <Text style={styles.guestSubtitle}>Log in to unlock more features.</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SocialAuth')}
                    style={styles.loginButton}
                >
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
            </View>
            ) : (
              <ImageBackground source={Images.aibg} resizeMode="cover" style={styles.background}>
                <SafeAreaView style={styles.container}>
                  {/* Back Button */}
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                  >
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
                    Let our Advanced AI Create personalized Travel
                    itineraries tailored to your interests, preferences, and
                    travel style. Experience smarter travel planning.
                  </Text>

                  {/* Features */}
                  {features.map((item, index) => (
                    <View key={index} style={styles.feature}>
                      <View>{item.icon}</View>
                      <View style={styles.featureText}>
                        <Text style={styles.featureTitle}>{item.title}</Text>
                        <Text style={styles.featureDescription}>{item.description}</Text>
                      </View>
                    </View>
                  ))}
                </SafeAreaView>

                {/* Button at Bottom */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("AIPlainTrip")}
                  activeOpacity={0.8}
                  style={styles.buttonContainer}
                >
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
            )}
    </View>
  );
};

export default AIPlainIntro;

// Features Data
const features = [
  {
    icon: <SVGS.OPTIONS width={wp(11)} height={wp(11)} />,
    title: 'Personalized Planning',
    description:
      'Let our Advanced AI create personalized travel itineraries tailored to your interests and preferences.',
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
  rootContainer: {
    flex: 1,
    backgroundColor: 'transparent', // Ensure background is transparent
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(3),
    justifyContent: 'flex-start',
    marginTop: hp(8), // Remove extra padding on iOS
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(2) : hp(0),
    left: wp(3),
  },
  title: {
    marginTop: hp(8),
    fontSize: hp(2.8),
    lineHeight: wp(9),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.TiffanyBlue,
    marginBottom: hp(1),
    paddingLeft: wp(2),
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
    paddingLeft: wp(2),
  },
  feature: {
    marginHorizontal: wp(2),
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
    bottom: hp(7),
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    height: hp(6),
    justifyContent: 'center',
    width: '100%',
    borderRadius: wp(2),
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.Medium,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
},
guestTitle: {
    fontSize: hp(2.5),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.darkgray,
    marginBottom: hp(1),
    textAlign: 'center',
},
guestSubtitle: {
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.darkgray1,
    textAlign: 'center',
    marginBottom: hp(4),
},
loginButton: {
    backgroundColor: COLORS.red,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(10),
    borderRadius: wp(2),
},
loginButtonText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.Medium,
},
});
