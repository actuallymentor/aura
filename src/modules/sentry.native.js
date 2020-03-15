import * as Sentry from 'sentry-expo'
import { SENTRY_DSN } from 'react-native-dotenv'

const SentryInit = f => {
	if( SENTRY_DSN ) Sentry.init( {
	  dsn: SENTRY_DSN,
	  enableInExpoDevelopment: false
	} )
}

export default SentryInit