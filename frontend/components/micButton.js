import React, {useEffect, useState} from "react";
import {StyleSheet, View,} from 'react-native';
import {IconButton} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {FontAwesome} from "@expo/vector-icons";


function micButtonHandler() {
    console.log('Mic pressed')
}

function micButton() {
    return (
        <View style={styles.buttonBar}>
            <IconButton
                android_ripple={{color: '#dddddd'}}
                onPress={micButtonHandler}
                style={({pressed}) => (pressed && styles.pressedButton)}
                icon={<Icon name="microphone" size={50} color={"grey"}/>}>
            </IconButton>
        </View>
    );
}

export default micButton;

const styles = StyleSheet.create({
    buttonBar: {
        flex: 1,
        borderColor: '#b3b3b3',
        borderTopWidth: 1,
        borderRadius: 40,
        width: '100%',
        height: '20%',
        justifyContent: "center",
    },
    pressedButton: {
        opacity: 0.5,
    }
})