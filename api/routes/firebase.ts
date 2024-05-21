import {
  checkTokenTimeStamps,
  getTopics,
  grantToken,
  subscribed,
  unsubscribed,
  updateTokenTime,
} from "../service/tokenService.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { serviceAccount } from "../config.ts";
import admin from "npm:firebase-admin";
import { Context, Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

/*
app.use("/api/subscribe", subscribe);
app.use("/api/unsubscribe", unsubscribe);
app.use("/api/timstamp", checkTokenTimeStamps);
app.use("/api/timestamp", updateTokenTime);
app.use("/api/subscriptions", getSubscriptions);
app.use("/api/grantToken", grantToken);

*/
async function subscribe(c: Context) {
    const body = await c.req.json();
    const { token, topic } = body;
    try {
      await subscribed(token, topic);
      await messaging.subscribeToTopic(token, topic);
      return new Response("구독 완료", {
        headers: {
          ...corsHeaders,
          "content-type": "application/json",
        },
      });
    } catch (error) {
      return new Response(error, {
        status: 500,
      });
    }
  }
  
  async function unsubscribe(c: Context) {
    try {
      const body = await c.req.json();
      const { token, topic } = body;
      await unsubscribed(token, topic);
      await messaging.unsubscribeFromTopic(token, topic);
      return new Response("구독 취소", {
        headers: {
          ...corsHeaders,
          "content-type": "application/json",
        },
      });
    } catch (error) {
      return new Response(error, {
        status: 500,
      });
    }
  }
  
  async function permission(c: Context) {
    try {
      const body = await c.req.json();
      const { token, time } = body;
      const result = await grantToken(token, time);
      if (!result.active) {
        return new Response(result.error, {
          status: 400,
        });
      }
      return new Response(JSON.stringify(result.active), {
        headers: {
          ...corsHeaders,
          "content-type": "application/json",
        },
      });
    } catch (error) {
      return new Response(error, {
        status: 500,
      });
    }
  }
  
  async function timestamp(c: Context) {
    try {
      const body = await c.req.json();
      const { oldToken, newToken, newTime } = body;
      const result = await updateTokenTime(oldToken, newToken, newTime);
      return new Response(JSON.stringify(result), {
        headers: {
          ...corsHeaders,
          "content-type": "application/json",
        },
      });
    } catch (error) {
      return new Response(error, {
        status: 500,
      });
    }
  }
  
  async function getTimestamp(c: Context) {
    try {
      const token = c.req.query("token");
      const result = await checkTokenTimeStamps(token);
      return new Response(JSON.stringify(result), {
        headers: {
          ...corsHeaders,
          "content-type": "application/json",
        },
      });
    } catch (error) {
      return new Response(error, {
        status: 500,
      });
    }
  }
  
  async function getSubscriptions(c: Context) {
    try {
      const token = c.req.query("token");
      const result = await getTopics(token);
      return new Response(JSON.stringify(result), {
        headers: {
          ...corsHeaders,
          "content-type": "application/json",
        },
      });
    } catch (error) {
      return new Response(error, {
        status: 500,
      });
    }
  }
  
  function router(hono: Hono) {
    const api = hono.basePath("/api");
    api.post("/subscribe", (context) => subscribe(context));
    api.post("/unsubscribe", (context) => unsubscribe(context));
    api.post("/permission", (context) => permission(context));
    api.post("/timestamp", (context) => timestamp(context));
    api.get("/timestamp", (context) => getTimestamp(context));
    api.get("/subscriptions", (context) => getSubscriptions(context));
    return api;
  }
  
  export { router };