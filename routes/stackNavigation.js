import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from "../screens/Login";
import Home from "../routes/tabNavigation"
import Signup from "../screens/Signup"
import EditExercise from "../screens/EditExercise"

const Stack = createStackNavigator();

const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#F2F6FC",
      card: "#1a1aff"
    },
  };

const StackNavigation = ({ onReady }) => {
    return (
        <NavigationContainer theme={AppTheme} onReady={onReady}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="EditExercise" component={EditExercise} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigation;