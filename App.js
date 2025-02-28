import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import TabStack from './src/navigation/BottomNavigation';
import { AIPlainIntro, AIPlainTrip, AIPlaintripDetails, ChangePassword, CreatePassword, EditProfile, ForgotPassword, Home, LoadingScreen, Login, OtpVerification, PlanTrip, PlanTripDetails, Privacy, Search, Signup, SocialAuth, Splash, Terms, Welcome } from './src/screens';
import { Provider } from 'react-redux';
import Store from './src/redux/Store'
import GlobalErrorBoundary from './src/utils/ErrorBoundary';

const Stack = createStackNavigator();

const App = () => {
    return (
        <Provider store={Store}>
            <GlobalErrorBoundary>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='Splash'>
                        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                        <Stack.Screen name="TabStack" component={TabStack} options={{ headerShown: false }} />
                        <Stack.Screen name="AIPlainTrip" component={AIPlainTrip} options={{ headerShown: false }} />
                        <Stack.Screen name="AIPlainIntro" component={AIPlainIntro} options={{ headerShown: false }} />
                        <Stack.Screen name="PlanTrip" component={PlanTrip} options={{ headerShown: false }} />
                        <Stack.Screen name="PlanTripDetails" component={PlanTripDetails} options={{ headerShown: false }} />
                        <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AiPlanTripDetails" component={AIPlaintripDetails} options={{ headerShown: false }} />
                        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
                        <Stack.Screen name="SearchScreen" component={Search} options={{ headerShown: false }} />
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
                    </Stack.Navigator>
                </NavigationContainer>
            </GlobalErrorBoundary>
        </Provider>
    )
}

export default App