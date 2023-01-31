import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Pressable} from 'react-native';
import {FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import {Audio} from "expo-av";

const ChatInput = () => {

    const [item, setItem] = useState("");

    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);

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

    const onSend = async () => {
        console.log("sending message: ", item);

        setItem("");
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={item}
                onChangeText={setItem}
                style={styles.input}
                placeholder="What type of video games do you like?"
            />
            <MaterialCommunityIcons
                onPress={onSend}
                style={styles.send}
                name="send" size={20}
                color="#9c27b0"/>
            <Pressable
                onPressIn={startRecording}
                onPressOut={stopRecording}
                android_ripple={{color: '#dddddd',
                    radius: 100}}
                hitSlop = {1}
                style={({pressed}) => [{
                    backgroundColor: pressed ? "#9e9e9e" : "whitesmoke",
                    opacity: pressed ? 0.5 : 1,
                },
                    styles.button]}
            >
                <FontAwesome
                    name="microphone"
                    size={20}
                    color={"#9c27b0"} />
            </Pressable>
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
        flex: 7,
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
        flex: 1,
        backgroundColor: "whitesmoke",
        padding: 7,
        borderRadius: 15,
        overflow: "hidden",
        marginHorizontal: 5,
    },
    button: {
        flex: 1,
        padding: 7,
        borderRadius: 15,
        overflow: "hidden",
        marginHorizontal: 5,
    }

});

export default ChatInput;