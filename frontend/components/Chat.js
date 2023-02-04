const {Audio, Video} = require("expo-av");
const {useRef, useState, React} = require("react");
const {ImageBackground, StyleSheet, SafeAreaView, View} = require("react-native");
const {GiftedChat, Send} = require("react-native-gifted-chat");
const {MaterialCommunityIcons} = require("@expo/vector-icons");
import {Pressable} from "react-native";
import {FontAwesome} from "@expo/vector-icons";

const user = require('../assets/user.png');
const ggeez = require('../assets/bot.png');
const BOT = {
    _id: 2,
    name: 'Bot',
    avatar: ggeez,
};

const Chat = () => {

    const [state, setState] = useState({
        messages: [{
            _id: 1,
            text: "Hello, I'm GGEEZ, here to help you find a video game that you like",
            createdAt: new Date(),
            user: BOT,
            audio: "",
            video: "",
        },],
        id: 1,
        name: ''
    });

    function handleServerResponse(response) {
        let text = response //text;

        sendBotResponse(text);
    }

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

        setState((prevState) => {
            messages: GiftedChat.append(prevState.messages, [msg])
        });
    }

    function onSend(messages = []) {
        setState(prevState => {
            messages: GiftedChat.append(prevState.messages, messages)
        });

        //just send text to server
        let message = messages[0].text;

        //send message to server
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

    // ####################### Recorder ############################

    const recorder = props => {

        const [recording, setRecording] = useState();
        const [recordings, setRecordings] = useState([]);

        async function startRecording() {
            try {
                console.log('Requesting permissions..');
                const permission = await Audio.requestPermissionsAsync();

                if (permission.granted) {
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
                    sendBotResponse("Please grant permission to app to access the microphone");
                }
            } catch (error) {
                console.log("Failed to start recording: ", error);
            }
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

            const uri = recording.getURI();
            console.log('Recording stopped and stored at', uri);
        }

        function getDurationFormatted(millis) {
            const minutes = millis / 1000 / 60;
            const minutesDisplay = Math.floor(minutes);
            const seconds = Math.round((minutes - minutesDisplay) * 60);
            const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
            return `${minutesDisplay}:${secondsDisplay}`;
        }

        return (
            <View>
                <Pressable
                    onPressIn={startRecording}
                    onPressOut={stopRecording}
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
    };

    // ###############################  Video ##############################

    const video = useRef(null);
    const [status, setStatus] = useState({});

    // ###############################  Chat  ##############################

    return (
        <SafeAreaView style={styles.background}>
            <ImageBackground source={require('../assets/background.png')} style={styles.background}>
                <GiftedChat
                    messages={state.messages}
                    onSend={(message) => onSend(message)}
                    showUserAvatar={true}
                    showAvatarForEveryMessage={true}
                    minInputToolbarHeight={70}
                    multiline
                    alwaysShowSend={true}
                    renderSend={(props) => customSend(props)}
                    renderActions={(props) => recorder(props)}
                    user={{
                        _id: 1,
                        name: "Me",
                        avatar: user,
                    }}
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
