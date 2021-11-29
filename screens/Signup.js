import * as React from 'react';
import { useState } from 'react';
import { Button, Text, View, TextInput, StyleSheet } from 'react-native';
import { firebase } from '../backend/firebase/config';

import HidableView from "../components/HidableView"

const Signup = ({ navigation }) => {
    const [name, onChangeName] = useState("");
    const [nameError, onChangeNameError] = useState(false);
    const [height, onChangeHeight] = useState("");
    const [heightError, onChangeHeightError] = useState(false);
    const [weight, onChangeWeight] = useState("");
    const [weightError, onChangeWeightError] = useState(false);
    const [age, onChangeAge] = useState("");
    const [ageError, onChangeAgeError] = useState(false);
    const [email, onChangeEmail] = useState("");
    const [emailError, onChangeEmailError] = useState(false);
    const [password, onChangePassword] = useState("");
    const [passwordError, onChangePasswordError] = useState(false);

    const onChangeNumber = (text) => {
        return text.replace(/[^0-9]/g, '')
    }

    const onSubmit = () => {
        let error = false;

        // Name check
        if (name.length < 3 || name.length > 20) {
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

        // Email check 
        let reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (reg.test(email.toLowerCase())) {
            onChangeEmailError(false);
        }
        else {
            onChangeEmailError(true);
            error = true;
        }

        // Password must be at least 6 characters
        if (password.length < 6) {
            onChangePasswordError(true);
            error = true;
        }
        else {
            onChangePasswordError(false);
        }

        if (!error) {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(response => {
                    const uid = response.user.uid;
                    console.log("User created in Firebase");
                    const userData = JSON.stringify({
                        'uid': uid,
                        'name': name,
                        'height': height,
                        'weight': weight,
                        'age': age,
                        'email': email
                    })
                    // Requires node server IP-address
                    fetch('http://192.168.0.221:3000/user',
                        {
                            method: 'POST',
                            body: userData,
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    .then(response => {
                        navigation.navigate("Home");
                        console.log("User created in MongoDB");
                    })
                    .catch(error => {
                        alert(error);
                    });
                })
                .catch(error => {
                    alert(error);
                })
        }
    }
    
    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Luo uusi käyttäjä</Text>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    onChangeText={text => onChangeName(text)}
                    value={name}
                    placeholder="Nimi"
                />
                <HidableView hide={!nameError} />
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    onChangeText={text => onChangeHeight(onChangeNumber(text))}
                    value={height}
                    keyboardType={"number-pad"}
                    placeholder="Pituus"
                />
                <HidableView hide={!heightError} />
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    onChangeText={text => onChangeWeight(onChangeNumber(text))}
                    value={weight}
                    keyboardType={"number-pad"}
                    placeholder="Paino"
                />
                <HidableView hide={!weightError} />
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    onChangeText={text => onChangeAge(onChangeNumber(text))}
                    value={age}
                    keyboardType={"number-pad"}
                    placeholder="Ikä"
                />
                <HidableView hide={!ageError} />
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    onChangeText={text => onChangeEmail(text)}
                    value={email}
                    keyboardType={"email-address"}
                    placeholder="Sähköposti"
                />
                <HidableView hide={!emailError} />
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={text => onChangePassword(text)}
                    value={password}
                    placeholder="Salasana"
                />
                <HidableView hide={!passwordError} />
            </View>
            <Button title="Luo käyttäjä" color="#0080ff" onPress={() => onSubmit()} />
        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        marginBottom: 40
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
    icon: {
        paddingBottom: 0
    }
});

export default Signup;