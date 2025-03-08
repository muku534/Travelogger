import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import TabStack from './src/navigation/BottomNavigation';
import { AIIternary, AIPlainIntro, AIPlainTrip, AIPlaintripDetails, BlogScreen, ChangePassword, CreatePassword, EditProfile, ForgotPassword, Home, Login, MyIternary, NotificationScreen, OtpVerification, PlanTrip, PlanTripDetails, Privacy, Profile, Search, Signup, SocialAuth, Splash, Terms, Welcome } from './src/screens';
import { Provider } from 'react-redux';
import GlobalErrorBoundary from './src/utils/ErrorBoundary';
import store from './src/redux/Store';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

const App = () => {
    return (
        <Provider store={store}>
            <GlobalErrorBoundary>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='Splash'>
                        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                        <Stack.Screen name="TabStack" component={TabStack} options={{ headerShown: false }} />
                        <Stack.Screen name="MyIternary" component={MyIternary} options={{ headerShown: false }} />
                        <Stack.Screen name="AIIternary" component={AIIternary} options={{ headerShown: false }} />
                        <Stack.Screen name="AIPlainTrip" component={AIPlainTrip} options={{ headerShown: false }} />
                        <Stack.Screen name="AIPlainIntro" component={AIPlainIntro} options={{ headerShown: false }} />
                        <Stack.Screen name="PlanTrip" component={PlanTrip} options={{ headerShown: false }} />
                        <Stack.Screen name="PlanTripDetails" component={PlanTripDetails} options={{ headerShown: false }} />
                        <Stack.Screen name="AiPlanTripDetails" component={AIPlaintripDetails} options={{ headerShown: false }} />
                        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
                        <Stack.Screen name="SearchScreen" component={Search} options={{ headerShown: false }} />
                        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
                        <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="SocialAuth" component={SocialAuth} options={{ headerShown: false }} />
                        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
                        <Stack.Screen name="OtpVerification" component={OtpVerification} options={{ headerShown: false }} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                        <Stack.Screen name="CreatePassword" component={CreatePassword} options={{ headerShown: false }} />
                        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                        <Stack.Screen name="SignUp" component={Signup} options={{ headerShown: false }} />
                        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                        <Stack.Screen name="Privacy" component={Privacy} options={{ headerShown: false }} />
                        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
                        <Stack.Screen name="Terms" component={Terms} options={{ headerShown: false }} />
                        <Stack.Screen name="BlogScreen" component={BlogScreen} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </NavigationContainer>
                <Toast />
            </GlobalErrorBoundary>
        </Provider>
    )
}

export default App