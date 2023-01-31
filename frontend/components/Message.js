import React from "react";
import { View, Text, StyleSheet} from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)

const Message = ({item}) => {

    const isMe = () => {
        return item.user.id !== "bot";
    }

    return (
        <View style={[styles.container,
            {
                backgroundColor: isMe() ? "#e0aaff" : "white",
                alignSelf: isMe() ? "flex-end" : "flex-start",
        }]}>
            <Text>{item.text}</Text>
            <Text style={styles.time}>{dayjs(item.createdAt).fromNow(true)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        alignSelf: "flex-start",
        margin: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: "80%",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,

        elevation: 1,
    },
    time: {
        color: "gray",
        alignSelf: "flex-end"
    }
})

export default Message;