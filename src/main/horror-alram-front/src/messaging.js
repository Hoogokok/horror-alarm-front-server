import axios from 'axios';
import {firebaseConfig} from "./config";
import Switch from '@mui/material/Switch';
import {useState, useEffect} from 'react';
import {initializeApp} from "firebase/app";
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage
} from "firebase/messaging";
import {FormControlLabel} from "@mui/material";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function createTokenAndTime() {
  const newToken = await getToken(messaging);
  const date = new Date(); // 현재 날짜 및 시간
  const newTime = date.toISOString().split('T')[0]; // "2023-04-22"
  return {newToken, newTime};
}

async function requestPermission() {
  console.log('Requesting permission...');
  try {
    await Notification.requestPermission();
    console.log('Permission granted');
    const {token, time} = await createTokenAndTime();
    console.log("time", time);
    await axios.post('/alarm/permission', {token: token, time: time});
  } catch (error) {
    console.error('Permission denied', error);
  }
}

async function subscribed(token) {
  try {
    const response = await axios.post('/alarm/horror/subscribe',
        {token: token, topic: 'horror-release'});
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
        {data: {token: token, topic: 'horror-release'}});
    console.log('Token deleted:', response.data);
  } catch (error) {
    console.error('An error occurred while deleting token. ', error);
  }
}

async function checkPermission() {
  try {
    const token = await getToken(messaging);
    return !!token;
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
  return false;
}

async function checkTokenTimeStamps() {
  try {
    const token = await getToken(messaging);
    const response = await axios.get('/alarm/checked/times',
        {params: {token: token}});
    const data = response.data;
    if (data.result) {
      await deleteToken(messaging);
      const {newToken, newTime} = await createTokenAndTime();
      console.log('새로운 토큰과 타임스태프:', newToken, newTime);
      await axios.post('/alarm/update/token',
          {oldToken: token, newToken: newToken, newTime: newTime});
    }
    console.log('토큰 타임스태프 체크 결과:', data);
  } catch (error) {
    console.error('An error occurred while retrieving token timestamps. ',
        error);
  }
}

function AlarmPermissionSwitch() {
  const [checked, setChecked] = useState(checkPermission());
  const handleChange = async () => {
    if (!checked) {
      await requestPermission();
    } else {
      alert('알람 해제를 하려면 브라우저 설정에서 알람을 해제해주세요.');
    }
  }
  useEffect(() => {
    checkTokenTimeStamps();
  }, []);
  return (
      <FormControlLabel control={<Switch
          checked={checked}
          onChange={handleChange}
          inputProps={{'aria-label': 'controlled'}}
      />} label={checked ? '알람 허용' : '알람 해제'}
      />
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

export {
  Subscribe,
  Unsubscribe,
  AlarmPermissionSwitch
};
