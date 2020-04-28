import { Analytics, PageHit, Event } from 'expo-analytics'
import { GA } from 'react-native-dotenv'

const tracking = new Analytics( GA )

export const pageView = location => tracking.hit( new PageHit( location || 'default' ) ).catch( e => console.log( e ) )

export const event = ( cat, action, label, value ) => tracking.event( new Event( cat, action, label, value ) ).catch( e => console.log( e ) )