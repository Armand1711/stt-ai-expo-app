import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import textToSpeech from './AIService';
import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');

  const handlePress = () => {
    if (text.trim()) {
      textToSpeech(text);
    } else {
      alert("Please enter text to convert.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Text-to-Speech AI Demo</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text to speak..."
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Convert to Speech" onPress={handlePress} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
});