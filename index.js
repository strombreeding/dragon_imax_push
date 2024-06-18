/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import mobileAds from 'react-native-google-mobile-ads';
import notifee, {AndroidImportance, AndroidColor} from '@notifee/react-native';

// mobileAds()
//   .setRequestConfiguration({
//     // Update all future requests suitable for parental guidance
//     maxAdContentRating: MaxAdContentRating.G,

//     // Indicates that you want your content treated as child-directed for purposes of COPPA.
//     tagForChildDirectedTreatment: false,

//     // Indicates that you want the ad request to be handled in a
//     // manner suitable for users under the age of consent.
//     tagForUnderAgeOfConsent: true,

//     // An array of test device IDs to allow.
//     // testDeviceIdentifiers: ['EMULATOR'],
//   })
//   .then(() => {
//     // Request config successfully set!
//   });
mobileAds()
  .initialize()
  .then(adapterStatuses => {
    // Initialization complete!
    console.log('✅ Admob Initialize', adapterStatuses);
  })
  .catch(err => {
    console.log('❌', err);
  });
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('이거슨');
// });
// notifee.onBackgroundEvent(async ({type, detail}) => {
//   console.log(type, detail, '크크');
// });

AppRegistry.registerComponent(appName, () => App);
