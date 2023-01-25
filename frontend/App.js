import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, FlatList, Image} from 'react-native';
import React, {useState} from 'react';
import Header from "./components/Header";
import MicButton from "./components/micButton";
import Message from "./components/Message";
import "./assets/favicon.png";


export default function App() {
    const [enteredMessageText, setEnteredMessageText] = useState('')
    const [messages, setMessages] = useState([]);

    function messageInputHandler(entredMessage) {
        setEnteredMessageText(entredMessage)
    }

    function addMessageHandler() {
        setMessages((currenMessages) => [
            ...currenMessages,
            {text: enteredMessageText, key: Math.random().toString()},
        ]);
    }

    return (
        <View style={styles.appContainer}>
            <Header/>
            <View style={styles.chatContainer}>
                <FlatList
                    data={messages}
                    renderItem={messageData => {
                        return (
                            <Message text={messageData.item.text} key={messageData.item.key}/>
                        )
                    }} alwaysBounceVertical={false}/>
            </View>
            <MicButton/>
        </View>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    chatContainer: {
        flex: 6,
        flexDirection: 'column',
        width: '100%',
        height: '35%',
    },
    logo: {
        resizeMode: 'cover',
        width: '70%',
        height: '70%'
    }
});
