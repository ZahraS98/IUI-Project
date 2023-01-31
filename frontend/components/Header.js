import {StyleSheet, Text, View, Image} from 'react-native';

const Header = () => {
    return (
        <View style={styles.header}>
            <Image style={styles.logo} source={require("../assets/bot.png")} />
            <Text style={styles.text}>GGEEZ</Text>
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',

        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#792d86',
        backgroundColor: '#9c27b0',

        marginTop: 20,
        paddingTop: 10,
    },
    text: {
        flex: 3,
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 10
        ,
    },
    logo: {
        flex: 1,
        borderRadius: 15,
        width: 50,
        height: 50,

        marginLeft: 10,
    },
});

//<Image styles={styles.logo} source={require('../assets/logo.png')}/>