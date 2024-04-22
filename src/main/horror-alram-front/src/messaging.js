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
import Alert from '@mui/material/Alert';


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function requestPermission() {
  console.log('Requesting permission...');
  try {
    await Notification.requestPermission();
    console.log('Permission granted');
    const token = await getToken(messaging);
    await axios.post('/alarm/permission', {token: token});
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

async function deletes() {
  await axios.delete('/alarm/permission', {data: {token: await getToken(messaging)}})
  await deleteToken(messaging);
  console.log('Token deleted');
}

async function GuideTolBockingAlarmsAlert(){
  return (
      <Alert severity="info">알람을 해제하려면 브라우저 설정에서 알람 설정을 해제해주세요</Alert>
  );
}

function AlarmPermissionSwitch() {
  const checkPermission = async () => {
    try {
      const token = await getToken(messaging);
      return !!token;
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
    }
    return false;
  }
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    checkPermission().then((result) => setChecked(result));
  }, []);
  const handleCheck = async () => {
    if (!checked) {
      await requestPermission();
    } else {
      await alert('알람을 해제하려면 브라우저 설정에서 알람 설정을 해제해주세요')
    }
  }
  return (
      <FormControlLabel control={<Switch
          checked={checked}
          onChange={handleCheck}
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

export {Subscribe, Unsubscribe, AlarmPermissionSwitch};
