import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from "@react-native-community/datetimepicker";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../backend/firebase/config';

const EditExercise = ({ route, navigation }) => {
    const { exercise } = route.params;
    
    const [date, onChangeDate] = useState(new Date());
    const [showDate, onChangeShowDate] = useState(false);
    const [hours, onChangeHours] = useState("");
    const [minutes, onChangeMinutes] = useState("");
    const [distance, onChangeDistance] = useState("");
    const [activeSport, onChangeActiveSport] = useState("Juoksu");
    const [activeIcon, onChangeActiveIcon] = useState("run");
    const [imageUrl, setImageUrl] = useState(null);
    const [sports, setSports] = useState([]);
    const [icons, setIcons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
        if (exercise != null) {
            onChangeDate(new Date(exercise.date));
            onChangeDistance(exercise.distance);
            onChangeHours(exercise.durationH);
            onChangeMinutes(exercise.durationMin);
            onChangeActiveIcon(exercise.icon);
            onChangeActiveSport(exercise.sport);
            setImageUrl(exercise.imageUrl);
        }
    }, []);

    async function getData() {
        // Get sport names
        await fetch('http://192.168.0.221:3000/sports')
        .then(async response => await response.json())
        .then(data => {
          data.map(sport => {
              setSports(sportList => [...sportList, sport.name]);
          });
        })
        .catch(error => console.log(error))

        // Get icons
        await fetch('http://192.168.0.221:3000/icons')
        .then(async response => await response.json())
        .then(data => {
          data.map(icon => {
              setIcons(iconsList => [...iconsList, icon.name]);
          });
          setLoading(false);
        })
        .catch(error => console.log(error))
    }

    const changeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        onChangeShowDate(false);
        onChangeDate(currentDate);
    }

    const showDatePicker = () => {
        onChangeShowDate(true);
    }

    const onChangeNumber = (text) => {
        let newText = text;
        if (newText.length > 2) {
            newText = newText.substring(0,2);
        }
        return newText.replace(/[^0-9]/g, '');
    }

    const onChangeDecimal = (text) => {
        if (text.length > 5) {
            text = text.substring(0,5);
        }
        return text.replace(/-|\s/g, '');
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.cancelled) {
          setImageUrl(result.uri);
        }
    };

    const saveExercise = async () => {
        if (minutes.length < 1 && hours.length < 1 && distance.length < 1) {
            alert("Syötä harjoituksen kesto tai matka");
        }
        else {
            if (exercise == null) {
                const exerciseObj = JSON.stringify({
                    'userId': firebase.auth().currentUser.uid,
                    'sport': activeSport,
                    'icon': activeIcon,
                    'date': date,
                    'durationH': hours,
                    'durationMin': minutes,
                    'distance': distance,
                    'imageUrl': imageUrl
                });
                // Requires node server IP-address
                await fetch('http://192.168.0.221:3000/exercise',
                    {
                        method: 'POST',
                        body: exerciseObj,
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    navigation.navigate("Home");
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else {
                const exerciseObj = JSON.stringify({
                    'userId': firebase.auth().currentUser.uid,
                    'id': exercise._id,
                    'sport': activeSport,
                    'icon': activeIcon,
                    'date': date,
                    'durationH': hours,
                    'durationMin': minutes,
                    'distance': distance,
                    'imageUrl': imageUrl
                });
                // Requires node server IP-address
                await fetch('http://192.168.0.221:3000/exercise',
                    {
                        method: 'PUT',
                        body: exerciseObj,
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    navigation.navigate("Home");
                })
                .catch(error => {
                    console.log(error);
                });
            }

            
        }
    }

    const deleteExercise = () => {
        Alert.alert("Vahvistus", "Haluatko varmasti poistaa tämän harjoituksen?",
            [
                { text: "Peruuta", style: "cancel" },
                { text: "Poista", onPress: async () => {
                    await fetch('http://192.168.0.221:3000/exercise?id=' + exercise._id, {
                        method: 'DELETE'
                    })
                    .then(res => {
                        navigation.navigate("Home");
                    })
                    .catch(err => {
                        console.error(err);
                    })
                } }
            ]
        );
    }

    const removePicture = () => {
        Alert.alert("Vahvistus", "Poistetaanko kuva tästä harjoituksesta?",
            [
                { text: "Peruuta", style: "cancel" },
                { text: "Poista", onPress: () => setImageUrl("") }
            ]
        );
    }
    
    if(!loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Valitse laji:</Text>
                <View style={styles.sportContainer}>
                    {sports.map((sport, key) => {
                        return (
                            <TouchableOpacity style={[styles.sport, activeSport === sport ? {backgroundColor: "#0073e6"} : null]} key={key} onPress={() => onChangeActiveSport(sport)}>
                                <Text style={[styles.sportText, sport === activeSport ? {fontSize: 20} : null]}>{sport}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={styles.exerciseInfo}>
                    <Text style={styles.smallHeader}>Harjoituksen ajankohta: </Text>
                    {showDate && (<DatePicker value={date} onChange={changeDate} mode="date" display="default" maximumDate={new Date()} />)}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.input} onPress={showDatePicker}>{date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear()}</Text>
                    </View>
                </View>
                <View style={styles.exerciseInfo}>
                    <Text style={styles.smallHeader}>Harjoituksen kesto:</Text>
                    <View style={styles.smallInputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => onChangeHours(onChangeNumber(text))}
                            value={hours}
                            keyboardType={"number-pad"}
                        />
                    </View>
                    <Text>tuntia</Text>
                    <View style={styles.smallInputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => onChangeMinutes(onChangeNumber(text))}
                            value={minutes}
                            keyboardType={"number-pad"}
                        />
                    </View>
                    <Text>minuuttia</Text>
                </View>
                <View style={styles.exerciseInfo}>
                    <Text style={styles.smallHeader}>Matka:</Text>
                    <View style={styles.mediumInputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => onChangeDistance(onChangeDecimal(text))}
                            value={distance}
                            keyboardType={"number-pad"}
                        />
                    </View>
                    <Text>km</Text>
                </View>
                <Text style={styles.header}>Valitse kuvake:</Text>
                <View style={styles.iconContainer}>
                    {icons.map((icon, key) => {
                        return (
                            <TouchableOpacity style={[styles.icon, activeIcon === icon ? {backgroundColor: "#0073e6"} : null]} key={key} onPress={() => onChangeActiveIcon(icon)}>
                                <Icon name={icon} size={activeIcon === icon ? 50 : 30} color="#ffffff" />
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <Text style={styles.header}>Lisää halutessasi kuva:</Text>
                {imageUrl ? 
                    <TouchableOpacity style={{ width: 340, height: 180, alignSelf: "center", margin: 6}} onPress={removePicture}>
                        <Image source={{ uri: imageUrl }} style={{ flex: 1 }} />
                    </TouchableOpacity>
                    : 
                    <TouchableOpacity onPress={pickImage}>
                        <Icon name={"image-plus"} size={60} color="#000000" style={{alignSelf: "center"}} />
                    </TouchableOpacity>
                }
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.addExercise} onPress={deleteExercise}>
                        <Text style={styles.addExerciseText}>Poista harjoitus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addExercise} onPress={saveExercise}>
                        <Text style={styles.addExerciseText}>Tallenna</Text>
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
        paddingTop: 30
    },
    header: {
        fontSize: 18,
        alignSelf: "center"
    },
    smallHeader: {
        fontSize: 16
    },
    sportContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
    },
    sport: {
        borderRadius: 10,
        backgroundColor: "#3399ff",
        alignItems: 'center',
        padding: 10,
        margin: 6,
        flexBasis: "30%"
    },
    sportText: {
        alignSelf: "center",
        fontSize: 16,
        color: "#ffffff"
    },
    iconContainer: {
        flexWrap: "wrap",
        flexDirection: "row"
    },
    icon: {
        borderRadius: 10,
        backgroundColor: "#3399ff",
        alignItems: 'center',
        padding: 10,
        margin: 6,
        flexBasis: "30%",
        justifyContent: "center",
        height: 60
    },
    exerciseInfo: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 6,
        alignItems: "baseline"
    },
    inputWrapper: {
        flexDirection: "row",
        width: 100,
        borderBottomWidth: 1,
        borderBottomColor: "#b1b1b1",
        paddingBottom: 2
    },
    smallInputWrapper: {
        flexDirection: "row",
        width: 38,
        borderBottomWidth: 1,
        borderBottomColor: "#b1b1b1",
        marginHorizontal: 3
    },
    mediumInputWrapper: {
        flexDirection: "row",
        width: 60,
        borderBottomWidth: 1,
        borderBottomColor: "#b1b1b1",
        marginHorizontal: 3
    },
    input: {
        flex: 1,
        paddingLeft: 10,
        color: "#05375a",
        fontSize: 15,
    },
    addExercise: {
        elevation: 8,
        borderRadius: 10,
        backgroundColor: "#0080ff",
        paddingVertical: 10,
        paddingHorizontal: 30
    },
    addExerciseText: {
        fontSize: 18,
        color: "#ffffff",
        fontWeight: "bold",
        alignSelf: "center"
    },
    bottomContainer: {
        flex: 1,
        flexDirection: "row",
        margin: 10,
        alignItems: "flex-end",
        justifyContent: "space-around",
    }
})

export default EditExercise;