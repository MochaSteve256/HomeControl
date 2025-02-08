# HomeControl
This is my android frontend for remotely starting my pc and controlling my led stripe.
It is made with Expo and React Native.

## Running
```bash
npx expo
```

## Compiling and bundling
```bash
# remove old files
rm build- #...xxx.aab
rm bundle.apks

# update app version code
```bash
vi app.json

# build
npx eas build -p android --local
java -jar bundletool-all-1.18.0.jar build-apks --bundle=Home/build- --output=Home/bundle.apks --ks=Home/android/my-release-key.jks --ks-key-alias=my-key-alias --mode=universal # append number and .aab to bundle path
```

