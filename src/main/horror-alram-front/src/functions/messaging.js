import {FIREBASE_CONFIG, SUPABASE_CONFIG} from '../config.js';
import {initializeApp as fcm} from "firebase/app";
import {createClient} from '@supabase/supabase-js'
import {
  getMessaging, getToken, deleteToken,
} from "firebase/messaging";

const supabaseClient = createClient(SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey);
const app = fcm(FIREBASE_CONFIG);
const messaging = getMessaging(app);

async function getSupabaseToken(token) {
  const {data, error} = await supabaseClient.from('token').select().eq('token',
      token);
  return {data, error};
}

async function getSupabaseTopic(topic) {
  const {data, error} = await supabaseClient.from('topic').select().eq('name',
      topic);
  return {data, error};
}

async function subscribed(token, topic) {
  /*
   1. 토큰이 존재하는 지 찾는다
   2. 토큰이 존재하면 해당 토큰을 사용하여 토픽을 구독한다
   */
  const tokenResponse = await getSupabaseToken(token);
  if (!tokenResponse.error) {
    const topicResponse = await getSupabaseTopic(topic);
    if (!topicResponse.error) {
      const {error} = await supabaseClient.from('topic_to_token').insert([{
        token_id: tokenResponse.data[0].id, topic_id: topicResponse.data[0].id
      }]);
      if (!error) {
        await fetch('http://localhost:3001/firebase/subscribe',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(
                  {
                    token: tokenResponse.data[0].token,
                    topic: topicResponse.data[0].name
                  })
            }).then(r => {
          console.log(r);
        }).catch((error) => {
          console.error("구독 실패", error);
        });
      }
    }
  }
}

async function unsubscribed(token, topic) {
  const tokenResponse = await getSupabaseToken(token);
  if (!tokenResponse.error) {
    const topicResponse = await getSupabaseTopic(topic);
    if (!topicResponse.error) {
      const {error} = await supabaseClient.from('topic_to_token').delete().eq(
          'token_id', tokenResponse.data[0].id).eq('topic_id',
          tokenResponse.data[0].id);
      if (!error) {
        await fetch('http://localhost:3001/firebase/unsubscribe',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(
                  {
                    token: tokenResponse.data[0].token,
                    topic: topicResponse.data[0].name
                  })
            }).then(r => {
          console.log(r);
        }).catch((error) => {
          console.error("구독 해제 실패", error);
        });
      }
    }
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

async function checkTokenTimeStamps(token) {
  /*
  1. 토큰의 시간이 한 달이 지났는지 확인한다.
  2. 한 달이 지났으면 새로운 토큰을 생성하고 시간을 업데이트한다.
  3. 한 달이 지나지 않았으면 토큰을 그대로 사용한다.
   */
  const {data, error} = await supabaseClient.from('token').select().eq('token',
      token);
  if (!error) {
    console.log("확인 작업 시작")
    const date = new Date(); // 현재 날짜 및 시간
    // "yyyy-mm-dd" 형식으로 변환
    const newTime = date.toISOString().split('T')[0];
    const tokenTime = data[0].time;
    // 한 달이 지났는지 확인
    if (isDifference30Days(tokenTime, newTime)) {
      console.log('Token is expired.');
      await deleteToken(messaging);
      const newToken = await getToken(messaging);
      console.log('New token:', newToken);
      await supabaseClient.from('token').update(
          {token: newToken, time: newTime}).eq('token', data[0].id);
      return {newToken, newTime};
    }
    return {newToken: token, time: tokenTime};
  } else {
    console.error('An error occurred while checking token timestamps. ', error);
  }
}

function isDifference30Days(tokenTime, newTime) {
  const tokenDate = new Date(tokenTime);
  const newDate = new Date(newTime);
  const diffTime = Math.abs(newDate - tokenDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 30;
}

async function getDataToken(token) {
  const {data, error} = await supabaseClient.from('token').select().eq('token',
      token);
  return data;
}

async function getSubscriptions(result) {
  const {
    data, error
  } = await supabaseClient.from('topic_to_token').select().eq('token_id',
      result[0].id);
  return data;
}

// 토큰을 사용하여 구독한 토픽을 가져온다
async function getCheckedTopicsSubscribed(token) {
  const result = await getDataToken(token);
  const result2 = await getSubscriptions(result);
  const topicIds = result2.map(topic => topic.topic_id);
  const {data, error} = await supabaseClient.from('topic').select().in('id',
      topicIds);
  const topicContents = data.map(topic => topic.name);
  return {topicContents};
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
    await supabaseClient.from('token').insert(
        [{token: newToken, time: newTime}]);
  } catch (error) {
    alert('알람 권한을 허용해주세요.');
  }
}

async function handleUpcomingMovieSubscribe(checkedPermission,
    checkedSubscribe) {
  if (checkedPermission) {
    const token = await getToken(messaging);
    if (!checkedSubscribe) {
      await subscribed(token, 'upcoming_movie');
      return true;
    } else {
      await unsubscribed(token, 'upcoming_movie');
      return false;
    }
  } else {
    alert('알람 권한을 허용해주세요.');
  }
}

async function handleAlarmPermission() {
  const permission = await checkPermission();
  if (permission === 'granted') {
    alert('알람을 해제하려면 브라우저 설정에서 알람 권한을 해제해주세요.');
    return true;
  }
  if (permission === 'denied') {
    await requestPermission().then(() => {
      checkPermission().then(result => {
        return result === 'granted';
      });
    });
  }
  if (permission === 'default') {
    await requestPermission().then(() => {
      checkPermission().then(result => {
        return result === 'granted';
      });
    });
  }
}

async function handleNetflixSubscribe(checkedPermission, checkNetflix) {
  if (checkedPermission) {
    const token = await getToken(messaging);
    if (!checkNetflix) {
      await subscribed(token, 'netflix_expiring');
      return true
    } else {
      await unsubscribed(token, 'netflix_expiring');
      return false;
    }
  } else {
    alert('알람 권한을 허용해주세요.');
  }
}

class AlarmStatus {
  permission = false;
  subscribe = [false, false];

  constructor(permission, subscribe) {
    this.permission = permission;
    this.subscribe = subscribe;
  }
}

async function handleInitialSubscription() {
  const permission = await checkPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging);
    const result = await checkTokenTimeStamps(token);
    const topics = await getCheckedTopicsSubscribed(result.newToken);
    const topicContents = topics.topicContents;
    return new AlarmStatus(true, [topicContents.includes('upcoming_movie'),
      topicContents.includes('netflix_expiring')]);
  }
  return new AlarmStatus(false, [false, false]);
}

export {
  requestPermission,
  checkPermission,
  handleAlarmPermission,
  handleUpcomingMovieSubscribe,
  handleNetflixSubscribe,
  handleInitialSubscription
};