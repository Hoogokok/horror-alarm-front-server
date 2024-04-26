import axios from 'axios';
import {firebaseConfig} from "./config";
import {useState, useEffect, useCallback} from 'react';
import {initializeApp} from "firebase/app";
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage
} from "firebase/messaging";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function subscribed(token, topic) {
  try {
    const response = await axios.post('/alarm/horror/subscribe',
        {token: token, topic: topic});
    console.log('Token saved:', response.data);
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    });
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
}

async function unsubscribed(token, topic) {
  try {
    const response = await axios.delete('/alarm/horror/unsubscribe',
        {data: {token: token, topic: topic}});
    console.log('Token deleted:', response.data);
  } catch (error) {
    console.error('An error occurred while deleting token. ', error);
  }
}

async function checkPermission() {
  try {
    const permission = await Notification.permission;
    console.log('Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('An error occurred while checking permission. ', error);
    return false;
  }
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

async function getCheckedTopicsSubscribed() {
  const token = await getToken(messaging);
  const response = await axios.get('/alarm/checked/subscribe',
      {params: {token: token}});
  return response.data;
}

async function createTokenAndTime() {
  try {
    const newToken = await getToken(messaging);
    const date = new Date(); // 현재 날짜 및 시간
    const newTime = date.toISOString().split('T')[0]; // "2023-04-22"
    return {newToken, newTime};
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
}

async function requestPermission() {
  console.log('Requesting permission...');
  try {
    await Notification.requestPermission();
    const {newToken, newTime} = await createTokenAndTime();
    console.log("Permission granted");
    await axios.post('/alarm/permission', {token: newToken, time: newTime});
  } catch (error) {
    alert('알람 권한을 허용해주세요.');
  }
}

function AlarmPermissionSwitch() {
  const [checkedPermission, setCheckedPermission] = useState(false);
  const [checkedSubscribe, setCheckedSubscribe] = useState([false, false]);

  const handleAlarmPermission = async () => {
    console.log('Alarm permission switch clicked.');
    try {
      const permission = await checkPermission();
      if (permission === 'granted') {
        alert('알람을 해제하려면 브라우저 설정에서 알람 권한을 해제해주세요.');
        return;
      }
      if (permission === 'denied') {
        await requestPermission();
        setCheckedPermission(true);
      }
      if (permission === 'default') {
        await requestPermission();
        setCheckedPermission(true);
      }

    } catch (error) {
      console.error('An error occurred while requesting permission. ', error);
    }
  }
  const handleUpcomingMovieSubscribe = async () => {
    if (checkedPermission) {
      const token = await getToken(messaging);
      if (!checkedSubscribe[0]) {
        await subscribed(token, 'upcoming_movie');
        setCheckedSubscribe([true, checkedSubscribe[1]])
      } else {
        await unsubscribed(token, 'upcoming_movie');
        setCheckedSubscribe([false, checkedSubscribe[1]]);
      }
    } else {
      alert('알람 권한을 허용해주세요.');
    }
  }

  const handleNetflixSubscribe = async () => {
    if (checkedPermission) {
      const token = await getToken(messaging);
      if (!checkedSubscribe[1]) {
        await subscribed(token, 'netflix_expired');
        setCheckedSubscribe([checkedSubscribe[0], true]);
      } else {
        await unsubscribed(token, 'netflix_expired');
        setCheckedSubscribe([checkedSubscribe[0], false]);
      }
    } else {
      alert('알람 권한을 허용해주세요.');
    }
  }

  const fetchData = useCallback(async () => {
    try {
      await checkPermission().then(result => {
            setCheckedPermission(result === 'granted');
            if (result === 'granted') {
              checkTokenTimeStamps();
              getCheckedTopicsSubscribed().then(result => {
                const topicContents = result.topicContents;
                setCheckedSubscribe([
                  topicContents.includes('upcoming_movie'),
                  topicContents.includes('netflix_expired')
                ]);
              });
            }
          }
      );
    } catch (error) {
      console.error('An error occurred while checking token timestamps. ',
          error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
      <FormGroup>
        <FormControlLabel control={<Switch
            checked={checkedPermission}
            onChange={handleAlarmPermission}
            inputProps={{'aria-label': 'controlled'}}
        />} label={checkedPermission ? '알람 허용' : '알람 해제'}/>
        <FormControlLabel control={<Switch
            checked={checkedSubscribe[0]}
            onChange={handleUpcomingMovieSubscribe}
            inputProps={{'aria-label': 'controlled'}}
        />} label={
          checkedSubscribe[0] ? '개봉 알림 중' : '개봉 알림 켜기'
        }/>
        <FormControlLabel control={<Switch
            checked={checkedSubscribe[1]}
            onChange={handleNetflixSubscribe}
            inputProps={{'aria-label': 'controlled'}}
        />} label={
          checkedSubscribe[1] ? '넷플릭스 스트리밍 종료 알림 중' : ' 넷플릭스 스트리밍 종료 알림 켜기'
        }/>
      </FormGroup>
  );
}

export {
  AlarmPermissionSwitch
};
