import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';

const MessageVideo = ({ props }) => {
    const video = React.useRef(null);

    return (
        <Video
            ref={video}
            style={styles.video}
            source={{
                uri: props.currentMessage.video,
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: Dimensions.get('window').width / 1.4,
        height: Dimensions.get('window').width / 1.4,
        borderRadius: 15,
        marginBottom: 5,
    },
});

export default MessageVideo;
