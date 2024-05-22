import {
  checkTokenTimeStamps,
  getTopics,
  grantToken,
  subscribed,
  unsubscribed,
  updateTokenTime,
} from "../service/tokenservice.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { serviceAccount } from "../config.ts";
import admin from "npm:firebase-admin";
import { Context, Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";

credential: admin.credential.cert(
  {
    "type": serviceAccount.type,
    "project_id": serviceAccount.projectId,
    "private_key_id": serviceAccount.privateKeyId,
    "private_key": serviceAccount.privateKey,
    "client_email": serviceAccount.clientEmail,
    "client_id": serviceAccount.clientId,
    "auth_uri": serviceAccount.authUri,
    "token_uri": serviceAccount.tokenUri,
    "auth_provider_x509_cert_url": serviceAccount.authProviderX509CertUrl,
    "client_x509_cert_url": serviceAccount.clientX509CertUrl
  }
),

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
    const result = await subscribed(token, topic);
    if (!result.subscribe) {
      return new Response(result.error, {
        status: 400,
      });
    }
    await messaging.subscribeToTopic(token, topic);
    return new Response("구독 완료", {
      headers: {
        ...corsHeaders,
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(error, {
      status: 500,
    });
  }
}

async function unsubscribe(c: Context) {
  try {
    const body = await c.req.json();
    const { token, topic } = body;
    const result = await unsubscribed(token, topic);
    if (!result.unsubscribe) {
      return new Response(result.error, {
        status: 400,
      });
    }
    await messaging.unsubscribeFromTopic(token, topic);
    return new Response("구독 취소", {
      headers: {
        ...corsHeaders,
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    if (!result.updateResult) {
      return new Response(result.error, {
        status: 400,
      });
    }
    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(error, {
      status: 500,
    });
  }
}

async function getTimestamp(c: Context) {
  try {
    const token = c.req.query("token");
    const result = await checkTokenTimeStamps(token);
    if(result.kind === 'err'){
      return new Response(String(result.error), { // 문자열로 변환
        status: 400,
      });
    }
    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(error, {
      status: 500,
    });
  }
}

async function getSubscriptions(c: Context) {
  try {
    const token = c.req.query("token");
    const result = await getTopics(token);
    if(result.kind === 'err'){
      return new Response(String(result.error), { 
        status: 400,
      });
    }
    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
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