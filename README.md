# Expo boilerplate

Boilerplate is compatible with android, ios and web.

Start with `npm run android/ios/web`.

Testing: `npm test` based on Jest.

## To implement

Based on your app you will have to edit:

- `modules/push.js` to implement `savePushToken` based on your needs

## While developing

In `App.js` you will find the `componentDidMount` function which makes the app go upside down when enabled (in case you have the demo phone plugged and rotated).

## Environment variables

Environment variables in `.env` file are mandatory. Empty strings are allowed (and disable the service)

```shell
SENTRY_DSN=''
SENTRY_ORG=''
SENTRY_PROJECT=''
SENTRY_AUTH_TOKEN=''
SENTRY_URL=''
AMPLITUDE_APIKEY=''
```
