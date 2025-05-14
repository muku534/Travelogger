import React, { useState } from 'react';
import {
    View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ScrollView, StatusBar, Alert
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS, fontFamily, Images } from '../../../constants';
import Button from '../../components/Button';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { signUp } from '../../services/authService';
import { storeDataInAsyncStorage } from '../../utils/Helper';
import { useDispatch } from 'react-redux';
import { SIGNUP_SUCCESS } from '../../redux/Actions';
import Toast from 'react-native-toast-message';
import logger from '../../utils/logger';

const avatars = [
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Felix&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Alex&backgroundColor=e0f7fa",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Charlie&backgroundColor=f8c291",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Jordan&backgroundColor=a29bfe",
];

const SignUp = ({ navigation }) => {
    const dispatch = useDispatch();
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
        setForm(prevState => ({ ...prevState, [key]: value }));
    };

    const handleSignup = async () => {
        const { name, email, password, confirmPassword, selectedAvatar } = form;

        if (!name || !email || !password || !confirmPassword || !selectedAvatar) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in all fields before signing up.',
                position: 'top'
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'Passwords do not match!',
                position: 'top'
            });
            return;
        }

        try {
            setLoading(true);
            const userData = {
                name, email, password, avatarImgUrl: selectedAvatar, createdBy: "Travelogger"
            };
            const response = await signUp(userData);

            await storeDataInAsyncStorage("userData", response)

            dispatch({
                type: SIGNUP_SUCCESS,
                payload: { userData: response }
            });
            Toast.show({
                type: 'success',
                text1: 'Account Created',
                text2: 'Your account has been successfully created.',
                position: 'top'
            });

            navigation.reset({ index: 0, routes: [{ name: 'TabStack' }] });
        } catch (error) {
            logger.error('Signup Error:', error);
            if (error.message.includes('users_name_key')) {
                // Show custom message for duplicate username
                Toast.show({
                    type: 'error',
                    text1: 'Username Already Taken',
                    text2: 'Please choose another username.',
                    position: 'top'
                });
            } else {
                // Show generic error
                Toast.show({
                    type: 'error',
                    text1: 'Signup Failed',
                    text2: error.message || 'Something went wrong.',
                    position: 'top'
                });
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <ScrollView>
                <View style={{ paddingVertical: hp(2) }}>
                    <Text style={styles.title}>Create Account</Text>

                    {/* Name Input */}
                    <InputField
                        label="Name"
                        icon={<FontAwesome name="user-o" size={hp(2.5)} color={COLORS.darkgray1} />}
                        placeholder="Enter Name"
                        value={form.name}
                        onChangeText={(text) => handleChange('name', text)}
                        editable={!loading}
                    />

                    {/* Email Input */}
                    <InputField
                        label="Email Address"
                        icon={<MaterialCommunityIcons name="email-outline" size={hp(2.5)} color={COLORS.darkgray1} />}
                        placeholder="Email ID"
                        value={form.email}
                        keyboardType="email-address"
                        onChangeText={(text) => handleChange('email', text)}
                        editable={!loading}
                    />

                    {/* Password Input */}
                    <InputField
                        label="Password"
                        icon={<MaterialCommunityIcons name="lock-outline" size={hp(2.5)} color={COLORS.darkgray1} />}
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
                        icon={<MaterialCommunityIcons name="lock-outline" size={hp(2.5)} color={COLORS.darkgray1} />}
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
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleChange('selectedAvatar', item)} style={styles.avatarWrapper}>
                                <Image source={{ uri: item?.replace("/svg?", "/png?") }} style={[styles.avatar, form.selectedAvatar === item && styles.selectedAvatar]} />
                            </TouchableOpacity>
                        )}
                    />


                    {/* Create Account Button */}
                    <Button
                        title="Create Account"
                        color={COLORS.red}
                        onPress={handleSignup}
                        disabled={loading}
                        loading={loading}
                    />

                    {/* Bottom Login Navigation */}
                    <View style={styles.bottomContainer}>
                        <Text style={styles.loginText}>Already have an Account? </Text>
                        <TouchableOpacity onPress={() => navigation.replace("Login")}>
                            <Text style={styles.loginBold}>Login Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
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
        paddingTop: Platform.OS === 'ios' ? hp(4) : hp(3)
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
        paddingLeft:wp(1),
        color: COLORS.darkgray,
    },
    eyeIcon: {
        position: 'absolute',
        right: wp(4),
    },
    avatarTitle: {
        fontSize: wp(4),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginVertical: hp(0.5),
    },
    avatarWrapper: {
        marginRight: wp(3),
        marginBottom: hp(3),
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
