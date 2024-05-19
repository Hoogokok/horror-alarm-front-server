import { createClient, PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.43.2";

const supbaseAnonKey= Deno.env.get('REACT_APP_SUPABASE_ANON_KEY');
const supbaseUrl = Deno.env.get('REACT_APP_SUPABASE_URL');
if(!supbaseAnonKey || !supbaseUrl) {
  throw new Error('supabase url 또는 supabase anon key가 존재하지 않습니다.');
}
const supabaseClient = createClient(supbaseUrl,supbaseAnonKey);

async function grantToken(token: any, time: any) {
  const { error } = await supabaseClient.from('token').insert([{ token }, { time }]);
  if (!error) {
    return { active: true, error: null };
  }
  console.error("An error occurred while granting token. ", error);
  return { active: false, error };
}

async function subscribed(token: any, topic: any) {
  /*
   1. 토큰이 존재하는 지 찾는다
   2. 토큰이 존재하면 해당 토큰을 사용하여 토픽을 구독한다
   */
  const tokenResponse = await getSupabaseToken(token);
  if (!tokenResponse.error) {
    const topicResponse = await getSupabaseTopic(topic);
    if (!topicResponse.error) {
      const tokenData = tokenResponse.data;
      const topicData = topicResponse.data;
      if (tokenData && topicData) {
        const { error } = await supabaseClient.from("topic_to_token").insert([{
          token_id: tokenData[0].id,
          topic_id: topicData[0].id,
        }]);
      }
    }
  }
}

async function unsubscribed(token: any, topic: any) {
  const tokenResponse = await getSupabaseToken(token);
  if (!tokenResponse.error) {
    const topicResponse = await getSupabaseTopic(topic);
    if (!topicResponse.error) {
      const tokenData = tokenResponse.data;
      if (tokenData) {
        const { error } = await supabaseClient.from("topic_to_token").delete()
          .eq(
            "token_id",
            tokenData[0].id,
          ).eq("topic_id", tokenData[0].id);
      }
    }
  }
}

async function checkTokenTimeStamps(token: any) {
  /*
  1. 토큰의 시간이 한 달이 지났는지 확인한다.
  2. 한 달이 지났으면 새로운 토큰을 생성하고 시간을 업데이트한다.
  3. 한 달이 지나지 않았으면 토큰을 그대로 사용한다.
   */
  const { data, error } = await getSupabaseToken(token);
  if (!error && data && data.length > 0) {
    console.log("확인 작업 시작");
    const date = new Date(); // 현재 날짜 및 시간
    // "yyyy-mm-dd" 형식으로 변환
    const newTime = date.toISOString().split("T")[0];
    const tokenTime = data[0].time;
    // 한 달이 지났는지 확인
    if (isDifference30Days(tokenTime, newTime)) {
      return { data: false, error: null };
    }
    return { data: true, error: null };
  } else {
    console.error("An error occurred while checking token timestamps. ", error);
    return { data: false, error };
  }
}

function isDifference30Days(
  tokenTime: string | number | Date,
  newTime: string | number | Date,
) {
  const tokenDate = new Date(tokenTime).getTime(); // Convert to number
  const newDate = new Date(newTime).getTime(); // Convert to number
  const diffTime = Math.abs(newDate - tokenDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 30;
}

async function updateTokenTime(oldToken: any, newToken: any, newTime: any) {
  const { data, error } = await getSupabaseToken(oldToken);
  if (!error && data) {
    await supabaseClient.from("token").update(
      { token: newToken, time: newTime },
    ).eq("token", data[0].id);
  }
}
// 토큰을 사용하여 구독한 토픽을 가져온다
async function getTopics(token: any) {
  const result = await getSupabaseToken(token);
  const result2 = await getSubscriptions(result);
  const topicIds = result2 ? result2.map((topic) => topic.topic_id) : [];
  const { data, error } = await supabaseClient.from("topic").select().in(
    "id",
    topicIds,
  );
  const topicContents = data ? data.map((topic) => topic.name) : [];
  return { topicContents };
}

async function getSupabaseToken(token: any) {
  const { data, error } = await supabaseClient.from('token').select().eq('token',
    token);
  return { data, error };
}

async function getSupabaseTopic(topic: any) {
  const { data, error } = await supabaseClient.from('topic').select().eq('name',
    topic);
  return { data, error };
}

async function getSubscriptions(result: { data: any; error?: PostgrestError | null; }) {
  const {
    data, error
  } = await supabaseClient.from('topic_to_token').select().eq('token_id',
    result.data[0].id);
  return { data, error };
}

export {
  subscribed,
  unsubscribed,
  checkTokenTimeStamps,
  getTopics,
  updateTokenTime,
  grantToken
};
