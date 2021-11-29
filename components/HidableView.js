import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text } from 'react-native';

const HidableView = ({ hide }) => {
    if (hide) {
        return null;
    }
    return (
        <View>
            <Icon name="error" size={25} color="red" />
        </View>
    )
}

export default HidableView;