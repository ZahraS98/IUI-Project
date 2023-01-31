import React, {useEffect, useState} from "react";
import {StyleSheet, View, Pressable} from 'react-native';
import {IconButton} from "@react-native-material/core";
import {FontAwesome} from "@expo/vector-icons";
import {Audio} from "expo-av";


const micButton = () => {

    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);

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
                console.log("Please grant permission to app to access microphone");
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
        const {sound, status} = await recording.createNewLoadedSoundAsync();
        updateRecordings.push({
            sound: sound,
            file: recording.getURI(),
        });
        console.log('recording stopped. File at: ' + recording.getURI());
        setRecordings(updateRecordings);
    }

    return (
        <View>
            <Pressable
                onPressIn={startRecording}
                onPressOut={stopRecording}
                android_ripple={{color: '#dddddd',
                                radius: 100}}
                hitSlop = {1}
                style={[styles.button,]}
            >
                <FontAwesome name="microphone" size={20} color={"white"}/>
            </Pressable>
        </View>
    );
};

export default micButton;

const styles = StyleSheet.create({
    pressedButton: {
        opacity: 0.5,
        color: 'red',
    },
    button: {
        backgroundColor: "#9c27b0",
        padding: 7,
        borderRadius: 15,
        overflow: "hidden",
        marginHorizontal: 5,
    }
});