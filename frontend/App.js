import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, FlatList, Image} from 'react-native';
import React from 'react';
import Header from "./components/Header";
import Chat from "./components/Chat";

export default function App() {

    return (
        <View style={styles.appContainer}>
            <View style={styles.chatContainer}>
                <Chat/>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    chatContainer: {
        flex: 7,
        flexDirection: 'column',
        width: '100%',
        height: '35%',
    },
});
