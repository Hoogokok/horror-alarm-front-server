import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import axios from 'axios';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "horror-alarm.firebaseapp.com",
  projectId: "horror-alarm",
  storageBucket: "horror-alarm.appspot.com",
  messagingSenderId: process.env.REACT_APP_MEASUREMENT_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);


async function requestPermission() {
  console.log('Requesting permission...');
  try {
    await Notification.requestPermission();
    console.log('Permission granted');
  }
  catch (error) {
    console.error('Permission denied', error);
  }

  try {
    const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
    const response = await axios.post('/api/subscribe', { token: token });
    console.log('Token saved:', response.data);
  }
  catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
}

async function deleteToken() {
  const swRegistration = messaging.swRegistration;
  const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
  console.log('Token before deletion:', token);
  swRegistration.pushManager.getSubscription().then((subscription) => {
    subscription.unsubscribe().then((successful) => {
      console.log('Token deletion successful:', successful);
      axios.delete('/api/unsubscribe', { data: { token: token } });
    }).catch((error) => {
      console.error('Token deletion failed:', error);
    });
  }
  ).catch((error) => {
    console.error('Token deletion failed:', error);
  });
}

function Subscribe() {
  return (
    <button onClick={requestPermission}>Subscribe</button>
  );
}

function Unsubscribe() {
  return (
    <button onClick={deleteToken}>Unsubscribe</button>
  );
}

export { Subscribe, Unsubscribe };
