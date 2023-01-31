import {ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import Message from './Message';
import messages from '../assets/data/messages.json'
import ChatInput from "./ChatInput";


const Chat = () => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 80}
            style={styles.imageBackground}
        >
            <ImageBackground source={require('../assets/background.png')} style={styles.imageBackground}>
                <FlatList
                    data={messages}
                    renderItem={({item}) => <Message message={item}/>}
                    style={styles.list}
                    inverted>
                </FlatList>
                <ChatInput/>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
    },
    list: {
        marginTop: 5,
        padding: 10,
    }
});

export default Chat;