# HomeControl
This is my android frontend for remotely starting my PC and controlling my LED stripe.
It is made using Expo and React Native.

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
vi app.json

# build
npx eas build -p android --local
java -jar bundletool-all-1.18.0.jar build-apks --bundle=Home/build- --output=Home/bundle.apks --ks=Home/android/my-release-key.jks --ks-key-alias=my-key-alias --mode=universal # append number and .aab to bundle path
```

