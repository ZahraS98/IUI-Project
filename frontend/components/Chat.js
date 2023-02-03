const {useState} = require("react");
const {ImageBackground, StyleSheet, View, SafeAreaView} = require("react-native");
const {GiftedChat} = require("react-native-gifted-chat");

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
        };

        setState((prevState) => {
            messages: GiftedChat.append(prevState.messages, [msg])
        });
    };

    function onSend(messages = []) {
        setState(prevState => ({
            messages: GiftedChat.append(prevState.messages, messages)
        }));

        //just send text to server
        let message = messages[0].text;

        //send message to server
    };

    return (
        <SafeAreaView style={styles.background}>
            <ImageBackground source={require('../assets/background.png')} style={styles.background}>
                <GiftedChat
                    messages={state.messages}
                    onSend={(message) => onSend(message)}
                    showAvatarForEveryMessage={true}
                    user={{_id: 1}}
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
    }
});

//<ImageBackground source={require('../assets/background.png')} style={styles.background}>
