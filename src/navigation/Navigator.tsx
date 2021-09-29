/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import splashScreen from '../screens/splashScreen';
import FormTest from '../screens/FormTest';

const Stack = createNativeStackNavigator();

interface Props {}

const MainNavigator = (props: Props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen name="Testing" component={FormTest} />
        <Stack.Screen
          options={{headerShown: false}}
          name="Splash"
          component={splashScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
