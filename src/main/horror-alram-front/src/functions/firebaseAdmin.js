import admin from "firebase-admin";
import serviceAccount
  from '../horror-alarm-firebase-adminsdk.json' assert {type: 'json'};
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';

const app = express();
const router = express.Router();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors(
    {
      origin: 'http://localhost:3000',
      credentials: true
    }
)); // CORS 설정
app.use(bodyParser.json());

router.post("/firebase/subscribe", async (req, res) => {
  console.log(req.body);
  const {token, topic} = req.body;
  const messaging = admin.messaging();
  await messaging.subscribeToTopic(token, topic);
  res.status(200).send("구독 완료");
});

router.post("/firebase/unsubscribe", async (req, res) => {
  console.log(req.body);
  const {token, topic} = req.body;
  const messaging = admin.messaging();
  await messaging.unsubscribeFromTopic(token, topic);
  res.status(200).send("구독 해제 완료");
});

app.use(router);
app.set('port', 3001);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});