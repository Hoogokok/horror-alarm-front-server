import admin from "firebase-admin";
import serviceAccount
  from './horror-alarm-c169a-firebase-admin.json' assert {type: 'json'};
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import {upcomingMovieJob, netflixExpiringJob} from "./messagingScheduleTask.js";
import schedule from "node-schedule";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const app = express();
const router = express.Router();
const messaging = admin.messaging();

// CORS 설정
app.use(cors(
    {
      origin: 'http://localhost:3000',
      credentials: true
    }
));
app.use(bodyParser.json());
app.use(router);
app.set('port', 3001);

router.post("/firebase/subscribe", async (req, res) => {
  const {token, topic} = req.body;
  await messaging.subscribeToTopic(token, topic);
  res.status(200).send("구독 완료");
});

router.post("/firebase/unsubscribe", async (req, res) => {
  const {token, topic} = req.body;
  await messaging.unsubscribeFromTopic(token, topic);
  res.status(200).send("구독 해제 완료");
});

await app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

const tasks = async () => {
  const expiringMessage = await netflixExpiringJob();
  const upcomingMessage = await upcomingMovieJob();
  if (expiringMessage) {
    await messaging.send(expiringMessage);
  }
  if (upcomingMessage) {
    await messaging.send(upcomingMessage);
  }
}

function scheduleTasks() {
  //매주 일요일 오전 10시
  console.log('스케줄러가 실행되었습니다.');
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = 0;
  rule.hour = 10;
  rule.minute = 0;
  rule.second = 0;
  rule.tz = 'Asia/Seoul';
  schedule.scheduleJob(rule, tasks);
}

scheduleTasks();