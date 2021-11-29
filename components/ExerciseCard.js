import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-shadow-cards';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ExerciseCard = ({ sport, date, icon, duration, distance, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={styles.cardView}>
                <Icon name={icon} size={50} color="#ffffff" />
                <View>
                    <Text style={styles.smallText}>{date}</Text>
                    <Text style={styles.mediumText}>{sport}</Text>
                </View>
                <View>
                    <HidableText hide={typeof duration === 'undefined'} text={duration} />
                    <HidableText hide={typeof distance === 'undefined'} text={distance} />
                </View>
            </Card>
        </TouchableOpacity>
    );
}

const HidableText = ({ hide, text }) => {
    if (hide) {
        return null;
    }
    return (
        <Text style={styles.exerciseInfo}>{text}</Text>
    );
}

const styles = StyleSheet.create({
    cardView: {
        flexDirection: "row",
        padding: 10,
        marginHorizontal: 20,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#289efe"
    },
    exerciseInfo: {
        alignSelf: "center",
        padding: 3,
        color: "#ffffff"
    },
    mediumText: {
        fontSize: 22,
        color: "#ffffff"
    },
    smallText: {
        alignSelf: "center",
        fontSize: 12,
        color: "#ffffff"
    }
});

export default ExerciseCard;