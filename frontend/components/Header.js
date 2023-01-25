import {StyleSheet, Text, View, Image} from 'react-native';
import {AppBar} from "@react-native-material/core";

function Header() {
    return (
        <View style={styles.header}>
            <Image styles={styles.logo} soruce={require('../assets/logo.png')}/>
            <Text style={styles.text}>GEEZ</Text>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: '#792d86',
        backgroundColor: '#9c27b0',
        width: '100%',
        height: '35%',
        paddingTop: 10,
        paddingLeft: 10,
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 10,
        alignSelf: "center",
    },
    logo: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
    }
});
