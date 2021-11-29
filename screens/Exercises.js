import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { firebase } from '../backend/firebase/config';
import { useFocusEffect } from '@react-navigation/native';

import ExerciseCard from "../components/ExerciseCard"

const Exercises = ({ navigation }) => {
    const [exerciseData, setExerciseData] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
      React.useCallback(() => {
        getData(); // Update data on screen focus
      }, [])
    );

    async function getData() {
      const uid = firebase.auth().currentUser.uid;
      await fetch('http://192.168.0.221:3000/exercise?uid=' + uid)
      .then(async response => await response.json())
      .then(data => {
        setExerciseData(data);
        setLoading(false);
      })
      .catch(error => console.log(error))
    }

    if (!loading) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {exerciseData.map((exercise, key) => {
              var duration = undefined;
              var distance = undefined;
              const date = new Date(exercise.date);
              const newDate = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear()
              if (exercise.durationH.length > 0 && exercise.durationMin.length > 0)
                duration = exercise.durationH + "h " + exercise.durationMin + "min";
              else if (exercise.durationH.length > 0) duration = exercise.durationH + "h";
              else if (exercise.durationMin.length > 0) duration = exercise.durationMin + "min";
              if (exercise.distance.length > 0) distance = exercise.distance + "km";
              return (
                  <ExerciseCard sport={exercise.sport} date={newDate} icon={exercise.icon} duration={duration}
                  distance={distance} onPress={() => navigation.navigate("EditExercise", { exercise: exercise })} key={key} />
              )
            })}
          </ScrollView>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.newExerciseButton} onPress={() => navigation.navigate("EditExercise", { exercise: null })}>
              <Text style={styles.newExerciseText}>Lisää harjoitus</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else {
      return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Loading...</Text></View>
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      paddingTop: 10
    },
    cardView: {
      flexDirection: "row",
      padding: 10,
      marginHorizontal: 20,
      marginTop: 20,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#289efe"
    },
    scrollView: {
      flex: 1
    },
    bottomContainer: {
      height: 44,
      margin: 10,
      justifyContent: "flex-end",
    },
    newExerciseButton: {
      elevation: 8,
      borderRadius: 10,
      backgroundColor: "#0080ff",
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    newExerciseText: {
      fontSize: 18,
      color: "#ffffff",
      fontWeight: "bold",
      alignSelf: "center"
    },
    exerciseInfo: {
      alignSelf: "center",
      padding: 3,
      color: "#ffffff"
    },
    mediumText: {
      fontSize: 22,
      color: "#ffffff"
    }
  });

export default Exercises;