module.exports = {
  "expo": {
    "name": "Oura Trend Dashboard",
    "description": "A trend dashboard for Oura ring data.",
    "slug": "oura-trend-dashboard",
    "privacy": "public",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "version": "3.0.0",
    "orientation": "default",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],


    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mentorpalokaj.ouratrenddashboard",
      "buildNumber": "3.0.0"
    },


    "android": {
      "package": "com.mentorpalokaj.ouratrenddashboard",
      "versionCode": 3,
      "permissions": [],
      icon: "./assets/android_icon_rounded.png",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive_icon.png",
        backgroundColor: "#ffffff"
      }
    },
    "scheme": "ouratrenddashboard",

     // Sentry config
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps"
        }
      ]
    },


  }
}
