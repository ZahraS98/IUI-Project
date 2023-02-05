import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet} from 'react-native';
import Chat from "./components/Chat";

function App() {

    return (
        <SafeAreaView style={styles.container}>
            <Chat/>
            <StatusBar style="auto"/>
        </SafeAreaView>
    );

}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
