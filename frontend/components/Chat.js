import {fetch} from "react-native/Libraries/Network/fetch";
const {Audio} = require("expo-av");
const {useState, React} = require("react");
const {ImageBackground, StyleSheet, SafeAreaView, View, Pressable} = require("react-native");
const {GiftedChat, Send} = require("react-native-gifted-chat");
const {MaterialCommunityIcons, FontAwesome} = require("@expo/vector-icons");
const MediaLibrary = require("expo-media-library");
const {base64} = require("react-native-base64");

const ggeez = require('../assets/bot.png');
const BOT = {
    _id: 2,
    name: "Bot",
    avatar: ggeez,
};

const user = require('../assets/user.png');
const ME = {
    _id: 1,
    name: "Me",
    avatar: user,
}

const server = "http://192.168.2.131:3000"

const Chat = () => {

    const [state, setState] = useState({
        messages: [
            {
                _id: 1,
                text: "Popular video game genres are: Action, RPGs or Shooters",
                createdAt: new Date(),
                user: BOT,
                video: "",
            },
            {
                _id: 2,
                text: "To make a recommendation, I need to know which type of genre you prefer - just type or record your answer. ",
                createdAt: new Date(),
                user: BOT,
                video: "",
            },
            {
                _id: 3,
                text: "Hello, I'm GGEEZ, here to help you find a video game that you all like to play.",
                createdAt: new Date(),
                user: BOT,
                video: "",
            },
        ],
        id: 1,
        name: ''
    });

    // to use in handle Server response
    function sendBotResponse(text) {
        let msg = {
            _id: state.messages.length + 1,
            text,
            createdAt: new Date(),
            user: BOT,
            audio: "",
            video: "",
        };

        setState((prevState) => ({
            messages: GiftedChat.append(prevState.messages, [msg])
        }));
    }

    function sendMessageToServer(text) {

        const requestOptions = {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({text: text})
        }

        fetch((server + "/textinput"), requestOptions)
            .then(response => {
                console.log(response.status);
                console.log(response.headers);
                return response.json();
            })
            .then(data => {
                console.log(data.toString());
                sendBotResponse(data);
            })
            .catch(error => {
                    console.log(error);
                }
            );

    }

    // send Text to server and display it on screen
    function onSend(messages = []) {
        setState(prevState => ({
            messages: GiftedChat.append(prevState.messages, messages)
        }));

        let messageText = messages[0].text;
        sendMessageToServer(messageText);
    }

    const customSend = props => {
        return (
            <Send {...props}>
                <View style={styles.send}>
                    <MaterialCommunityIcons name="send" size={20} color="#0e98f4"/>
                </View>
            </Send>
        )
    }

    // ###############################  Recorder  ##############################

    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            const permission = await Audio.requestPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

            if (permission.granted && mediaLibraryPermission.granted) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                    allowsRecordingAndroid: true,
                    playInSilentModeAndroid: true,

                });

                console.log('Starting recording..');
                const {recording} = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );

                setRecording(recording);
                console.log('Recording started');
            } else {
                sendBotResponse("Please grant permission to app to access the microphone and media");
            }
        } catch (error) {
            console.log("Failed to start recording: ", error);
        }
    }

    function sendAudio(file) {

        let requestOptions = {
            method: "POST",
            header: "content-type: multipart/form-data",
            body: file
        }

        fetch((server + "/input"), requestOptions)
            .then(response => {
                    console.log(response.status);
                    console.log(response.headers);
                    return response.json()
                }
            )
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();

        let updateRecordings = [...recordings];
        const {sound, status} = await recording.createNewLoadedSoundAsync();
        updateRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        });

        setRecordings(updateRecordings);

        const blobToBase64 = (blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise((resolve) => {
                reader.onloadend = () => {
                    resolve(reader.result);
                };
            });
        };

        const audioURI = recording.getURI();

        console.log('Recording stopped and stored at', audioURI);

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", audioURI, true);
            xhr.send(null);
        });

        const audioBase64 = await blobToBase64(blob);

        console.log(audioBase64);

        sendAudio(JSON.stringify({
            inputFile: audioBase64
        }));

        blob.close()
    }

    function getDurationFormatted(millis) {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplay}:${secondsDisplay}`;
    }

    const recorder = () => {
        return (
            <View>
                <Pressable
                    onPress={recording ? stopRecording : startRecording}
                    android_ripple={{
                        color: '#dddddd',
                        radius: 100
                    }}
                    hitSlop={{top: 5, bottom: 5, right: 5, left: 5}}
                    style={({pressed}) => [{
                        backgroundColor: pressed ? "#9e9e9e" : "white",
                        opacity: pressed ? 0.5 : 1,
                    },
                        styles.button]}
                >
                    <FontAwesome
                        name="microphone"
                        size={20}
                        color={"#0e98f4"}/>
                </Pressable>
            </View>
        );
    }

// ###############################  Chat  ##############################

    return (
        <SafeAreaView style={styles.background}>
            <ImageBackground source={require('../assets/background.png')} style={styles.background}>
                <GiftedChat
                    messages={state.messages}
                    onSend={(message) => onSend(message)}
                    showUserAvatar={true} S
                    showAvatarForEveryMessage={true}
                    minInputToolbarHeight={90}
                    alwaysShowSend={true}
                    renderSend={(props) => customSend(props)}
                    renderActions={() => recorder()}
                    user={ME}
                />
            </ImageBackground>
        </SafeAreaView>
    );
}

export default Chat;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        height: "100%",
        width: "100%",
    },
    textInput: {
        backgroundColor: "white",
        borderColor: "lightgray",
        borderWidth: StyleSheet.hairlineWidth,
        fontSize: 16,
    },
    send: {
        justifyContent: "center",
        height: "100%",
        width: "130%",
        padding: 8,
    },
    button: {
        flex: 1,
        padding: 7,
        borderRadius: 15,
        overflow: "hidden",
        marginHorizontal: 5,
        justifyContent: "center",
    }
});
