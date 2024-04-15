import axios from 'axios';
import { useEffect } from 'react';
import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage
} from "firebase/messaging";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function requestPermission() {
  console.log('Requesting permission...');
  try {
    await Notification.requestPermission();
    console.log('Permission granted');
    const token = await getToken(messaging);
    await axios.post('/alarm/permission', { token: token });
  } catch (error) {
    console.error('Permission denied', error);
  }
}

async function subscribed(token) {
  try {
    const response = await axios.post('/alarm/horror/subscribe',
      { token: token, topic: 'horror-release' });
    console.log('Token saved:', response.data);
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    });
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
}

async function unsubscribed(token) {
  try {
    const response = await axios.delete('/alarm/horror/unsubscribe',
      { data: { token: token, topic: 'horror-release' } });
    console.log('Token deleted:', response.data);
  } catch (error) {
    console.error('An error occurred while deleting token. ', error);
  }
}

async function send() {
  await axios.get('/alarm/horror/send-release-message');
  console.log('Message sent');
}

async function deletes() {
  await deleteToken(messaging);
  await axios.delete('/alarm/permission');
  console.log('Token deleted');
}


function AlarmPermission() {
  return (
    <button onClick={requestPermission}>Request Permission</button>
  );
}

function Send() {
  return (
    <button onClick={send}>Send</button>
  );
}

function Subscribe() {
  const handleSubscribe = async () => {
    const token = await getToken(messaging);
    await subscribed(token);
  }

  return (
    <button onClick={handleSubscribe}>Subscribe</button>
  );
}

function Unsubscribe() {
  const handleUnsubscribe = async () => {
    const token = await getToken(messaging);
    await unsubscribed(token);
  }

  return (
    <button onClick={handleUnsubscribe}>Unsubscribe</button>
  );

}

function DismissingAlarms() {
  return (
    <button onClick={deletes}>Delete</button>
  );
}



export { Subscribe, Unsubscribe, Send, AlarmPermission, DismissingAlarms };
