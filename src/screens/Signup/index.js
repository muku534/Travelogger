import React, { useState } from 'react';
import {
    View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ScrollView, StatusBar, Alert
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS } from '../../../constants';
import Button from '../../components/Button';
import fontFamily from '../../../constants/fontFamily';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { signUp } from '../../services/Api';

const avatars = [
    require('../../../assets/images/avatar1.png'),
    require('../../../assets/images/avatar2.png'),
    require('../../../assets/images/avatar3.png'),
    require('../../../assets/images/avatar4.png'),
];

const SignUp = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedAvatar: null
    });
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        console.log(`Updating ${key}:`, value); // Debugging log
        setForm(prevState => ({ ...prevState, [key]: value }));
    };

    const handleSignUp = async () => {
        const { name, email, password, confirmPassword, selectedAvatar } = form;

        console.log("Submitting SignUp form with data:", form); // Debugging log

        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required');
            console.log("Error: Missing required fields.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            console.log("Error: Passwords do not match.");
            return;
        }
        if (!selectedAvatar) {
            Alert.alert('Error', 'Please select an avatar');
            console.log("Error: Avatar not selected.");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending sign-up request to API...");
            const userData = { name, email, password, avatarImgUrl: selectedAvatar };
            const response = await signUp(userData);
            console.log("API Response:", response); // Debugging log

            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('Login');
        } catch (error) {
            console.error("Signup Error:", error); // Debugging log
            Alert.alert('Error', error.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <ScrollView>
                <View style={{ paddingVertical: hp(2) }}>
                    <Text style={styles.title}>Create Account</Text>

                    {/* Name Input */}
                    <InputField
                        label="Name"
                        icon={<FontAwesome name="user" size={hp(3)} color={COLORS.darkgray1} />}
                        placeholder="Enter Name"
                        value={form.name}
                        onChangeText={(text) => handleChange('name', text)}
                        editable={!loading}
                    />

                    {/* Email Input */}
                    <InputField
                        label="Email Address"
                        icon={<MaterialCommunityIcons name="email-outline" size={hp(3)} color={COLORS.darkgray1} />}
                        placeholder="Email ID"
                        value={form.email}
                        keyboardType="email-address"
                        onChangeText={(text) => handleChange('email', text)}
                        editable={!loading}
                    />

                    {/* Password Input */}
                    <InputField
                        label="Password"
                        icon={<MaterialCommunityIcons name="lock-outline" size={hp(3)} color={COLORS.darkgray1} />}
                        placeholder="Password"
                        value={form.password}
                        secureTextEntry={isPasswordShown}
                        onChangeText={(text) => handleChange('password', text)}
                        editable={!loading}
                        toggleSecure={() => setIsPasswordShown(!isPasswordShown)}
                        isSecure={isPasswordShown}
                    />

                    {/* Confirm Password Input */}
                    <InputField
                        label="Confirm Password"
                        icon={<MaterialCommunityIcons name="lock-outline" size={hp(3)} color={COLORS.darkgray1} />}
                        placeholder="Re-Enter Password"
                        value={form.confirmPassword}
                        secureTextEntry={isConfirmPasswordShown}
                        onChangeText={(text) => handleChange('confirmPassword', text)}
                        editable={!loading}
                        toggleSecure={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                        isSecure={isConfirmPasswordShown}
                    />

                    {/* Avatar Selection */}
                    <Text style={styles.avatarTitle}>Choose Avatar</Text>
                    <FlatList
                        data={avatars}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleChange('selectedAvatar', item)} style={styles.avatarWrapper}>
                                <Image source={item} style={[styles.avatar, form.selectedAvatar === item && styles.selectedAvatar]} />
                            </TouchableOpacity>
                        )}
                    />

                    {/* Create Account Button */}
                    <Button
                        title="Create Account"
                        color={COLORS.red}
                        onPress={() => navigation.navigate("CreatePassword")}
                        disabled={loading}
                        style={styles.createAccountButton}
                    />

                    {/* Bottom Login Navigation */}
                    <View style={styles.bottomContainer}>
                        <Text style={styles.loginText}>Already have an Account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginBold}>Login Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const InputField = ({ label, icon, placeholder, value, onChangeText, keyboardType = 'default', secureTextEntry, editable, toggleSecure, isSecure }) => (
    <View>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
            {icon}
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={COLORS.darkgray}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
            />
            {toggleSecure && (
                <TouchableOpacity onPress={toggleSecure} style={styles.eyeIcon}>
                    <MaterialIcons name={isSecure ? "visibility-off" : "visibility"} size={24} color={COLORS.darkgray1} />
                </TouchableOpacity>
            )}
        </View>
    </View>
);

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: wp(4),
        paddingTop: hp(3),
    },
    title: {
        fontSize: wp(6),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        marginVertical: hp(1),
    },
    label: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(1),
        height: hp(6),
        borderColor: COLORS.Midgray,
        borderWidth: 0.5,
        borderRadius: wp(2),
        paddingLeft: wp(2),
    },
    input: {
        flex: 1,
        color: COLORS.darkgray,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
    },
    avatarTitle: {
        fontSize: wp(4),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginVertical: hp(0.5),
    },
    avatarWrapper: {
        marginRight: wp(3),
        borderRadius: wp(3),
    },
    avatar: {
        width: wp(20.5),
        height: wp(20.5),
        borderRadius: wp(3),
    },
    selectedAvatar: {
        borderWidth: 2,
        borderColor: COLORS.red,
    },
    createAccountButton: {
        width: wp(90),
        alignSelf: 'center',
        borderRadius: wp(3),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp(4),
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: hp(2),
    },
    loginText: {
        fontSize: wp(4.5),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
    },
    loginBold: {
        fontSize: wp(4.5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.red,
    },
});
