import { AMPLITUDE_APIKEY } from 'react-native-dotenv'
import * as Amplitude from 'expo-analytics-amplitude'

Amplitude.initialize( AMPLITUDE_APIKEY )

export default Amplitude