import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Exercises from "../screens/Exercises";
import Settings from "../screens/Settings";
import Info from "../screens/Info";

const Tab = createBottomTabNavigator();

const Home = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, iconColor, iconSize }) => {
                    let iconName;
                    iconColor = "#ffffff";
                    iconSize = 30;

                    // Unselected icons have only outlines
                    // and selected is shown with normal icon
                    if (route.name === 'Harjoitukset') {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === 'Asetukset') {
                        iconName = focused ? "settings" : "settings-outline";
                    }
                    else if (route.name === 'Info') {
                        iconName = focused ? "information-circle" : "information-circle-outline";
                    }

                    return <Icon name={iconName} size={iconSize} color={iconColor} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'white',
                inactiveTintColor: '#b5b5ff'
            }}
        >
            <Tab.Screen name="Harjoitukset" component={Exercises} />
            <Tab.Screen name="Asetukset" component={Settings} />
            <Tab.Screen name="Info" component={Info} />
        </Tab.Navigator>
    )
}

export default Home;