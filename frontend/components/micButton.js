import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, Pressable, Button} from 'react-native';
import {IconButton} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {FontAwesome} from "@expo/vector-icons";
import {Audio} from "expo-av";
import Voice from '@react-native-community/voice';

function micButton() {

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStartHandler;
        Voice.onSpeechEnd = onSpeechEndHandler;
        Voice.onSpeechResults = onSpeechResultsHandler;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners)
        }
    }, []);

    const onSpeechStartHandler = (e) => {
        console.log("start handler: ", e);
    }

    const onSpeechEndHandler = (e) => {
        console.log("stop handler: ", e);
    }

    const onSpeechResultsHandler = (e) => {
        console.log("speech result handler: ", e);
    }

    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    const [message, setMessage] = React.useState("");

    async function startRecording() {
        try {
            console.log('Requesting permissions');
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingAndroid: true,
                    playInSilentModeAndroid: true,
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                console.log("started recording");
                const {recording} = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
                console.log("Recording started");
            } else {
                setMessage("Please grant permission to app to access microphone");
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('stopping recording');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();

        let updateRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        updateRecordings.push({
            sound: sound,
            file: recording.getURI(),
        });
        console.log('recording stopped. File at: ' + recording.getURI());
        setRecordings(updateRecordings);
    }

    return (
        <View style={styles.buttonBar}>
            <Text>{message}</Text>
            <Pressable
                onPressIn={startRecording}
                onPressOut={stopRecording}
                android_ripple={{color: '#dddddd',
                                radius: 100}}
                hitSlop = {50}
                style={({pressed}) => (pressed && styles.pressedButton)}
            >
                <IconButton icon={<Icon name="microphone" size={50} color={"grey"}/>}/>
            </Pressable>
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
        alignItems: "center",
    },
    pressedButton: {
        opacity: 0.5,
        color: 'red',
    }
})