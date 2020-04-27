# StopCovid App

StopCovid is an app that can be downloaded voluntarily and facilitates the contact tracing process amidst the ongoing Covid-19 pandemic in Djiboui.

With the user's consent the app keeps their location data. In case the contact tracing team of the Department of Civil Protection and Emergency Management needs to track someone's movements, they will be asked to upload their location data.

This would allow for the tracing team to help retrace a user's movements for the last two weeks and increase the likelihood of identifying individuals you might have been in contact with. 

## Setup

Make sure you have a [Node 12+](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) set up on your machine.

Then go to the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) page, click the `React Native CLI Quickstart` tab, then select your `Development OS` and `Target OS` to get a detailed guide to configure your machine for app development.

Finally, install the project dependencies:

```
yarn install
```

## Run instructions for iOS:

```
yarn ios
```

or:
* Open MyTestApp/ios/MyTestApp.xcworkspace in Xcode or run "xed -b ios"
* Hit the Run button

You need XCode and an Apple developer account to run this on device.

### Troubleshooting

If you get this error when building the project for iOS:

```
error: /Users/pedroteixeira/projects/rakning-c19-app/ios/Pods/Target Support Files/Pods-Rakning/Pods-Rakning.debug.xcconfig: unable to open file (in target "Rakning" in project "Rakning") (in target 'Rakning' from project 'Rakning')
```

Try running `yarn prepare`, which should fix this issue.

For other CocoaPods issues, it sometimes helps to go into the `ios` folder and run:

```.env
pod install --repo-update
```

## Run instructions for Android:

Have an Android emulator running (quickest way to get started), or a device connected.
Then run:

```
yarn android
```

## FAQ

### How can I get the app?

Never install the app from places not listed here or on
[libcare.net](https://libcare.net), since they can be spreading a modified
version of the app which could compromise your privacy and security.

### How does StopCovid work?

It authenticates users with their phone number. It stores the user's
phone number, their locale and push notification token on the server.

Then the app requests permission to track the user's location in the
background. Geolocation updates are then stored on-device in a SQLite
database.

When the backend receives a request for data, it marks the user for data
collection and triggers a push notification.

Next time the user opens the app, it checks if there's a data request
and allows the user to approve the request before sending 14 days of
geolocation data to the backend.

### How does StopCovid track the user's location?

StopCovid uses a React Native plugin called [React Native Background Geolocation](https://github.com/mauron85/react-native-background-geolocation).
Behind the scenes, it calls different APIs on Android and iOS to get geolocation updates,
even when you don't have the application opens.

These geolocation updates are stored in an SQLite database that the plugin manages.

The logic is in `src/tracking.js`.

### When does the app send geolocation data to the backend?

Only after the user explicitly approves a data collection request.

The logic is in `src/router/logged-in/screens/RequestDataScreen.js`.
