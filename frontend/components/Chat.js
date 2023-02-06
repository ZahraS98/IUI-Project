const {Audio} = require("expo-av");
const {useState, React} = require("react");
const {ImageBackground, StyleSheet, SafeAreaView, View, Pressable} = require("react-native");
const {GiftedChat, Send} = require("react-native-gifted-chat");
const {MaterialCommunityIcons, FontAwesome} = require("@expo/vector-icons");
const {Video} = require("./Video");

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

        fetch("http://192.168.2.143:3000/textinput", requestOptions)
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

    function sendAudio(file) {

        let msg = {
            _id: state.messages.length + 1,
            text: "",
            createdAt: new Date(),
            user: ME,
            audio: file,
            video: "",
        };

        setState((prevState) => ({
            messages: GiftedChat.append(prevState.messages, [msg])
        }));

        let messageAudio = msg.audio;
        //send message to server
        fetch("http://192.168.2.143:5000/input", {
            method: "POST",
            body: {inputFile: messageAudio},
            headers: {
                "Content-Type": "text/html; charset=utf-8"
            },
        }).then(response => {
            console.log(response.status);
            console.log(response.headers);
            return response.json();
        }).then(
            (result) => {
                console.log(result);
            },
            (error) => {
                console.log(error);
            }
        );
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
        sendAudio(uri);
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
    }

    // ###############################  Video  ##############################


// ###############################  Chat  ##############################

    return (
        <SafeAreaView style={styles.background}>
            <ImageBackground source={require('../assets/background.png')} style={styles.background}>
                <GiftedChat
                    renderMessageVideo={(props) => <Video props={props}/>}
                    messages={state.messages}
                    onSend={(message) => onSend(message)}
                    showUserAvatar={true}
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
