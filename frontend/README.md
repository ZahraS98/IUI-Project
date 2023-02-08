# Get GGEEZ Client up and running

## Description

GGEEZ is a tool to help you choose a video game. 

## Installations

Needs [`node`](https://nodejs.org/en/), [`yarn`](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) and [`expo-cli`](https://expo.dev/tools) installed on machine. <br/>
For `expo-cli` <mark>`sudo`</mark> might be needed for installation  

### For Running App on mobile Device
 
 - Install [`Expo Go`](https://expo.dev/expo-go)App on mobile device. This App can be found in Google Play and the App Store.

### For Running App on Android Emulator

 - Install [`Android Studio`](https://developer.android.com/studio/install) on machine (For Linux: Available in Snap Store). <br/>
 - Open Android Studio 
 - From Android Studio Welcome screen, select **More Actions > Virtual Device Manager**
 - After opening a project, select **View > Tool Windows > Device Manager** from the main menu bar, and then click **Create device**
 - Be sure to check that during creation the column of **Play Store** <mark>shows</mark> Play Store Icon
 - Configs for Device used to test:
   - Pixel 2 API 31
 - Make sure that the same Android SDK is also installed on machine
 - For official ADV Guide, click [here](https://developer.android.com/studio/run/managing-avds)
 - Install Android SDK via Android Studio
   - Go to **Settings > System Settings > Android SDK** and install same SDK chosen for ADV.
 - You may also need to update your PATH-variables for Android Studio to find your installed Android SDK


## Usage

- To start the <mark>local</mark> expo server, type `npx expo start` in same directory as <mark>package.json</mark> file <br/>
   - To connect to official expo server, type `expo start` <br/>
- For ADV: 
  - Start Emulator
  - Then enter `a` in same console-window, where you started your expo-server. It will install the Expo Go App on your ADV and start the App
- For Device: 
  - Scan QR-Code and follow the link. It will open the app in your Expo Go App

### App Usage

![Screenshot of UI](https://github.com/ZahraS98/IUI-Project/blob/main/frontend/assets/GGEEZ-Bot.png)

## Contributing

Rebecca Fendt
