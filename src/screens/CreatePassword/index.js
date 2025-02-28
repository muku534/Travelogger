import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";
import fontFamily from "../../../constants/fontFamily";
import Ionicons from "react-native-vector-icons/Ionicons";
import CreatePasswordImage from "../../../assets/images/Create_Password.svg";
import Button from '../../components/Button';
import Email from '../../../assets/icons/email.svg';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const CreatePassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        // Simulate a network request here
        setTimeout(() => {
            setLoading(false);
            navigation.navigate("TabStack");
        }, 200); // Simulating network request with timeout
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <View style={styles.container}>
                {/* Header */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={wp(6)} color="black" />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    {/* Forgot Password Icon */}
                    <View style={styles.svgContainer}>
                        <CreatePasswordImage width={hp(35)} height={hp(25)} />
                    </View>

                    {/* Forgot Password Title */}
                    <Text style={styles.title}>Create Password</Text>

                    {/* Instruction Text */}
                    <Text style={styles.instruction}>
                        Create a Strong Password that you will never forgot it again
                    </Text>

                    {/* Input Field */}
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

                    {/* Submit Button */}
                    <Button
                        title={"Confirm Password"}
                        color={COLORS.red}
                        onPress={handleSubmit}
                        style={styles.button}
                        disabled={loading}
                    />
                </View>
            </View>
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

export default CreatePassword;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    backButton: {
        marginTop: hp(8),
    },
    svgContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(3),
    },
    title: {
        fontSize: wp(6),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginBottom: hp(1),
    },
    instruction: {
        fontSize: wp(3.7),
        paddingHorizontal: wp(2),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray1,
        textAlign: 'center',
        marginBottom: hp(3),
    },
    inputWrapper: {
        width: '100%',
        marginBottom: hp(2),
    },
    label: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },
    inputContainer: {
        width: '100%',
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
        paddingLeft: wp(2),
        color: COLORS.darkgray,
        fontSize: wp(4),
    },
    eyeIcon: {
        position: 'absolute',
        right: wp(4),
    },
    button: {
        width: wp(90),
        marginVertical: hp(2),
        alignSelf: 'center',
        borderRadius: wp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
