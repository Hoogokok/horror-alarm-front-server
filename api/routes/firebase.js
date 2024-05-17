import {
    subscribed,
    unsubscribed,
    checkTokenTimeStamps, updateTokenTime, getTopics, grantToken
} from "../service/tokenservice.js";
import { config } from "dotenv";
import { serviceAccount } from "../../config.js";
import admin from "firebase-admin";
import express from "express";

config();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const messaging = admin.messaging();
const app = express();
const router = express.Router();

/*
app.use("/api/subscribe", subscribe);
app.use("/api/unsubscribe", unsubscribe);
app.use("/api/timstamp", checkTokenTimeStamps);
app.use("/api/timestamp", updateTokenTime);
app.use("/api/subscriptions", getSubscriptions);
app.use("/api/grantToken", grantToken);

*/
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.post("/grantToken", permission);
router.post("/timestamp", timestamp);
router.get("/timestamp", getTimestamp);
router.get("/subscriptions", getSubscriptions);

async function subscribe(req, res) {
    const { token, topic } = req.body;
    try {
        await subscribed(token, topic);
        await messaging.subscribeToTopic(token, topic);
        res.status(200).send("구독 완료");
    }
    catch (error) {
        res.status(500).send(error);
    }
}

async function unsubscribe(req, res) {
    const { token, topic } = req.body;
    try {
        await unsubscribed(token, topic);
        await messaging.unsubscribeFromTopic(token, topic);
        res.status(200).send("구독 해제 완료");
    }
    catch (error) {
        res.status(500).send(error);
    }
}

async function permission(req, res) {
    const { token, time } = req.body;
    try {
        const result = await grantToken(token, time);
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

async function timestamp(req, res) {
    const { oldToken, newToken, newTime } = req.body;
    try {
        const result = await updateTokenTime(oldToken, newToken, newTime);
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
}


async function getTimestamp(req, res) {
    const { token } = req.query;
    try {
        const result = await checkTokenTimeStamps(token);
        res.status(200).send({ result });
    }
    catch (error) {
        res.status(500).send(error);
    }
}

async function getSubscriptions(req, res) {
    const { token } = req.query;
    try {
        const result = await getTopics(token);
        res.status(200).send({ result });
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export {
    router
};