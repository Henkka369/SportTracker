import * as React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { firebase } from '../backend/firebase/config';
import { useFocusEffect } from '@react-navigation/native';

import HidableView from "../components/HidableView"

const Settings = ({ navigation }) => {
    const [name, onChangeName] = useState("");
    const [nameError, onChangeNameError] = useState(false);
    const [height, onChangeHeight] = useState("");
    const [heightError, onChangeHeightError] = useState(false);
    const [weight, onChangeWeight] = useState("");
    const [weightError, onChangeWeightError] = useState(false);
    const [age, onChangeAge] = useState("");
    const [ageError, onChangeAgeError] = useState(false);
    const [oldPassword, onChangeOldPassword] = useState("");
    const [oldPasswordError, onChangeOldPasswordError] = useState(false);
    const [newPassword1, onChangeNewPassword1] = useState("");
    const [newPassword2, onChangeNewPassword2] = useState("");
    const [newPasswordError, onChangeNewPasswordError] = useState(false);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
          getData(); // Update data on screen focus
          return () => {
            // Clear errors when unfocus
            onChangeNameError(false);
            onChangeHeightError(false);
            onChangeWeightError(false);
            onChangeAgeError(false);
            onChangeOldPasswordError(false);
            onChangeNewPasswordError(false);
            onChangeNewPassword1("");
            onChangeNewPassword2("");
            onChangeOldPassword("");
          }
        }, [])
    );

    async function getData() {
        const uid = firebase.auth().currentUser.uid;
        await fetch('http://192.168.0.221:3000/user?uid=' + uid)
        .then(async response => await response.json())
        .then(data => {
          onChangeName(data[0].name);
          onChangeHeight(data[0].height);
          onChangeWeight(data[0].weight);
          onChangeAge(data[0].age.toString());
          setLoading(false);
        })
        .catch(error => console.log(error))
    }

    const saveUser = () => {
        let error = false;
        
        // Name check
        if (name.length < 1 || name.length > 15) {
            onChangeNameError(true);
            error = true;
        }
        else {
            onChangeNameError(false);
        }

        // Height check
        if (height.length < 1 || parseInt(height) < 100 || parseInt(height) > 250) {
            onChangeHeightError(true);
            error = true;
        }
        else {
            onChangeHeightError(false);
        }

        // Weight check
        if (weight.length < 1 || parseInt(weight) < 30 || parseInt(weight) > 300) {
            onChangeWeightError(true);
            error = true;
        }
        else {
            onChangeWeightError(false);
        }
        
        // Age check
        if (age.length < 1 || parseInt(age) < 18 || parseInt(age) > 99) {
            onChangeAgeError(true);
            error = true;
        }
        else {
            onChangeAgeError(false);
        }
        
        if (!error) {
            console.log("Update started");
            const uid = firebase.auth().currentUser.uid;
            const userData = JSON.stringify({
                'uid': uid,
                'name': name,
                'height': height,
                'weight': weight,
                'age': age
            })
            // Requires node server IP-address
            const res = fetch('http://192.168.0.221:3000/user',
            {
                method: 'PUT',
                body: userData,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log("User data changed");
            })
            .catch(error => {
                alert(error);
            });
        }
    }

    const onChangeNumber = (text) => {
        return text.replace(/[^0-9]/g, '');
    }

    // Password check
    const passwordCheck = () => {
        var error = false;
        const user = firebase.auth().currentUser;

        // Old password check
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            oldPassword
        );
        user.reauthenticateWithCredential(credential).then(() => {
            onChangeOldPasswordError(false);
            if (!error) {
                user.updatePassword(newPassword1).then(() => {
                    alert("Salasana vaihdettu");
                }).catch(error => {
                    console.log(error);
                    alert("Salasanan vaihtaminen epäonnistui");
                });
            }
            error = false;
        }).catch(error => {
            console.log(error);
            onChangeOldPasswordError(true);
            error = true;
        });

        // New password check
        if (newPassword1 === newPassword2 && newPassword1.length > 6) {
            onChangeNewPasswordError(false);
            error = false;
        }
        else {
            onChangeNewPasswordError(true);
            error = true;
        }
    }

    const logout = () => {
        firebase.auth().signOut().then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login'}]
            });
        }).catch(error => {
            alert(error);
        })
    }
    
    if (!loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Muokkaa omia tietoja</Text>
                <Text style={styles.fieldInfo}>Nimi</Text>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => onChangeName(text)}
                        value={name}
                    />
                    <HidableView hide={!nameError} />
                </View>
                <Text style={styles.fieldInfo}>Pituus</Text>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => onChangeHeight(onChangeNumber(text))}
                        value={height}
                        keyboardType={"number-pad"}
                    />
                    <HidableView hide={!heightError} />
                </View>
                <Text style={styles.fieldInfo}>Paino</Text>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => onChangeWeight(onChangeNumber(text))}
                        value={weight}
                        keyboardType={"number-pad"}
                    />
                    <HidableView hide={!weightError} />
                </View>
                <Text style={styles.fieldInfo}>Ikä</Text>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => onChangeAge(onChangeNumber(text))}
                        value={age}
                        keyboardType={"number-pad"}
                    />
                    <HidableView hide={!ageError} />
                </View>
                <Button title="Vahvista muutokset" color="#0080ff" onPress={saveUser} />
                <Text style={styles.title}>Vaihda salasana</Text>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={text => onChangeOldPassword(text)}
                        value={oldPassword}
                        placeholder="Vanha salasana"
                    />
                    <HidableView hide={!oldPasswordError} />
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={text => onChangeNewPassword1(text)}
                        value={newPassword1}
                        placeholder="Uusi salasana"
                    />
                    <HidableView hide={!newPasswordError} />
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={text => onChangeNewPassword2(text)}
                        value={newPassword2}
                        placeholder="Vahvista uusi salasana"
                    />
                    <HidableView hide={!newPasswordError} />
                </View>
                <Button title="Vaihda salasana" color="#0080ff" onPress={passwordCheck} />
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutText}>Kirjaudu ulos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    else {
        return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Loading...</Text></View>
    }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      marginTop: 16,
      padding: 20
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10
    },
    fieldInfo: {
        paddingLeft: 10,
        color: "grey"
    },
    logoutButton: {
        elevation: 8,
        borderRadius: 10,
        backgroundColor: "#0080ff",
        paddingVertical: 10
    },
    bottomContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    logoutText: {
        fontSize: 18,
        color: "#ffffff",
        fontWeight: "bold",
        alignSelf: "center"
    },
    inputWrapper: {
        flexDirection: "row",
        width: 250,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#b1b1b1",
        paddingBottom: 2
    },
    input: {
        flex: 1,
        paddingLeft: 10,
        color: "#05375a",
    },
});

export default Settings;