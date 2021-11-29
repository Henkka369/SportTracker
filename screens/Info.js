import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Info = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tietoja sovelluksesta</Text>
            <Text style={styles.row}>Käyttäjän rekisteröinti: Tehty</Text>
            <Text style={styles.row}>Sisäänkirjautuminen: Tehty</Text>
            <Text style={styles.row}>Salasanan muuttaminen: Tehty</Text>
            <Text style={styles.row}>Uloskirjautuminen: Tehty</Text>
            <Text style={styles.row}>Splash Screen: Tehty</Text>
            <Text style={styles.row}>Suoritusten listanäkymä: Tehty</Text>
            <Text style={styles.row}>Suorituksen lisääminen: Tehty</Text>
            <Text style={styles.row}>Suorituksen muokkaaminen: Tehty</Text>
            <Text style={styles.row}>Suorituksen poistaminen: Tehty</Text>
            <Text style={styles.row}>Logon lisääminen suoritukseen: Tehty</Text>
            <Text style={styles.row}>Valokuvan lisääminen suoritukselle: Tehty</Text>
            <Text style={styles.row}>Sovelluksessa on useita (3) välilehtiä: Tehty</Text>
            <Text style={styles.row}>Omien tietojen muuttaminen asetuksissa: Tehty</Text>
            <Text style={styles.row}>Lajien lataaminen serveriltä: Tehty</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        margin: 10
    },
    row: {
        fontSize: 16,
        padding: 3
    }
})

export default Info;