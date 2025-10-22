import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { Buffer } from 'buffer';

const API_KEY = 'AIzaSyDz15I3vGdzql4KGgTDiyOi-sxc-QxRQps';
const GOOGLE_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

const setAudioMode = async () => {
  await Audio.requestPermissionsAsync();
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: false,
    playThroughEarpieceAndroid: false,
  });
};

const textToSpeech = async (text) => {
  try {
    console.log("Generating speech...");

    await setAudioMode();

    const response = await axios.post(GOOGLE_TTS_URL, {
      input: { text },
      voice: {
        languageCode: 'en-US',
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
      },
    });

    const audioContent = response.data.audioContent;

    // Convert base64 to binary buffer and write as binary
    const audioBuffer = Buffer.from(audioContent, 'base64');
    const filePath = FileSystem.documentDirectory + 'tts-output.mp3';
    await FileSystem.writeAsStringAsync(filePath, audioBuffer.toString('binary'), { encoding: null });

    // Verify file existence and play
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: filePath },
        { shouldPlay: true },
        () => console.log("Sound loaded")
      );
      await sound.playAsync();
      console.log("Speech playback complete.");
    } else {
      throw new Error("Audio file not created");
    }
  } catch (error) {
    console.error('Error using Google TTS API:', error);
  }
};

export default textToSpeech;