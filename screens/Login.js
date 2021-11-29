import * as React from 'react';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Text, View, TextInput, StyleSheet } from 'react-native';
import { firebase } from '../backend/firebase/config';

const Login = ({ navigation }) => {
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");

    const login = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                const uid = response.uid;
                console.log("Login succesfully");
                navigation.navigate("Home");
            })
            .catch(error => {
                alert(error);
            })
    }
    
    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Kirjaudu sisään</Text>
            <View style={styles.inputWrapper}>
                <Icon name="email-outline" size={25} color="#000000" />
                <TextInput 
                    style={styles.input}
                    onChangeText={text => onChangeEmail(text)}
                    value={email}
                    keyboardType={"email-address"}
                    placeholder="Sähköposti"
                />
            </View>
            <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={25} color="#000000" />
                <TextInput 
                    style={styles.input}
                    onChangeText={text => onChangePassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Salasana"
                />
            </View>
            <Button title="Kirjaudu sisään" color="#0080ff" onPress={login} />
            <Text style={styles.createUserButton} onPress={() => navigation.navigate("Signup")}>Luo käyttäjä</Text>
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
    createUserButton: {
        textDecorationLine: "underline",
        color: "#0080ff",
        fontSize: 14,
        margin: 10
    }
});

export default Login;