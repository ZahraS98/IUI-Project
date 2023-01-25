import {StyleSheet, Text, View} from 'react-native';

function Message(props) {
    return (
        <View key={props.key} style={styles.botMessage}>
            <Text style={styles.messageText}>
                {props.text}
            </Text>
        </View>
    )
}

export default Message;

const styles = StyleSheet.create({
    userMessage: {
        margin: 8,
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#9c27b0',
    },
    botMessage: {
        margin: 8,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#c579d2',
    },
    messageText: {
        color: 'white',
    },
})