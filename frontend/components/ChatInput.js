import React, {useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import MicButton from "./micButton";

const ChatInput = () => {

    const [newItem, setNewItem] = useState("");

    const onSend = async () => {
        console.log("sending message: ", newItem);



        setNewItem("");
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={newItem}
                onChangeText={setNewItem}
                style={styles.input}
                placeholder="What type of video games do you like?"
            />
            <MaterialCommunityIcons onPress={onSend} style={styles.send} name="send" size={20} color="white"/>
            <MicButton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "whitesmoke",
        padding: 5,
    },
    input: {
        flex: 2,
        backgroundColor: "white",
        padding: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,

        borderRadius: 50,
        borderColor: "lightgray",
        borderWidth: StyleSheet.hairlineWidth,

        fontSize: 16,
    },
    send: {
        backgroundColor: "#9c27b0",
        padding: 7,
        borderRadius: 15,
        overflow: "hidden",
        marginHorizontal: 5,
    }

});

export default ChatInput;