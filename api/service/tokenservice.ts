import { createClient, PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { Database } from '../../database.types.ts';
import "jsr:@std/dotenv/load";

const supbaseAnonKey = Deno.env.get('REACT_APP_SUPABASE_ANON_KEY');
const supbaseUrl = Deno.env.get('REACT_APP_SUPABASE_URL');
if (!supbaseAnonKey || !supbaseUrl) {
  throw new Error('supabase url 또는 supabase anon key가 존재하지 않습니다.');
}
const supabaseClient = createClient<Database>(supbaseUrl, supbaseAnonKey);

async function grantToken(token: string, time: string): Promise<{ active: boolean, error: PostgrestError | null }> {
  const { error } = await supabaseClient.from('token').insert({ token: token, time: time });
  if (!error) {
    return { active: true, error: null }
  }
  console.error(" 토큰 저장 중 예외가 발생했습니다. ", error);
  return { active: false, error };
}

async function subscribed(token: string, topic: string): Promise<{ subscribe: boolean, error: PostgrestError | string }> {
  /*
   1. 토큰이 존재하는 지 찾는다
   2. 토큰이 존재하면 해당 토큰을 사용하여 토픽을 구독한다
   */
  const tokenResult = await getSupabaseToken(token);
  if (tokenResult.kind === 'ok') {
    const topicResult = await getSupabaseTopic(topic);
    if (topicResult.kind === 'ok') {
      const tokenData = tokenResult.value.data;
      const topicData = topicResult.value.data;
      const { error } = await supabaseClient.from("topic_to_token").insert([{
        token_id: tokenData.id,
        topic_id: topicData.id,
      }]);
      if (error) {
        console.error("주제 구독동안 예외가 발생했습니다.", error);
        return { subscribe: false, error };
      }
      return { subscribe: true, error: "" };
    }
    return { subscribe: false,  error: "주제를 찾을 수 없습니다." };
  }
  return { subscribe: false, error: "토큰을 찾을 수 없습니다." };
}

async function unsubscribed(token: string, topic: string): Promise<{ unsubscribe: boolean, error: PostgrestError | null | Error }> {
  const tokenResult = await getSupabaseToken(token);
  if (tokenResult.kind === 'ok') {
    const topicResult = await getSupabaseTopic(topic);
    if (topicResult.kind === 'ok') {
      const tokenData = tokenResult.value.data

      const { error } = await supabaseClient.from("topic_to_token").delete()
        .eq(
          "token_id",
          tokenData.id,
        ).eq("topic_id", topicResult.value.data.id);
      if (error) {
        console.error("주제 구독 취소 동안 예외가 발생했습니다.", error);
        return { unsubscribe: false, error };
      }
      console.log("주제 구독 취소 성공");
      return { unsubscribe: true, error: null };
    }
    return { unsubscribe: false, error: topicResult.kind === 'err' ? topicResult.error : null };
  }
  return { unsubscribe: false, error: tokenResult.kind === 'err' ? tokenResult.error : null };
}

async function checkTokenTimeStamps(token: string): Promise<Result<SupabaseResponse, Error>> {
  /*
  1. 토큰의 시간이 한 달이 지났는지 확인한다.
  2. 한 달이 지났으면 새로운 토큰을 생성하고 시간을 업데이트한다.
  3. 한 달이 지나지 않았으면 토큰을 그대로 사용한다.
   */
  const result = await getSupabaseToken(token);
  console.log("토큰 시간 확인", result);
  if (result.kind === 'ok') {
    console.log("확인 작업 시작");
    const date = new Date(); // 현재 날짜 및 시간
    // "yyyy-mm-dd" 형식으로 변환
    const newTime = date.toISOString().split("T")[0];
    const tokenTime = result.value.data.time;
    // 한 달이 지났는지 확인
    if (isDifference30Days(tokenTime, newTime)) {
      return { kind: 'ok', value: { data: true } };
    }
    return { kind: 'ok', value: { data: false } };
  } else {
    return { kind: 'err', error: result.error };
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

async function updateTokenTime(oldToken: string, newToken: string, newTime: string): Promise<{ updateResult: boolean, error: PostgrestError | null }> {
  const { data, error } = await supabaseClient.from("token").select().eq("token", oldToken).returns<{ id: number, token: string, time: string }>();
  if (!error) {
    const { error } = await supabaseClient.from("token").update(
      { token: newToken, time: newTime },
    ).eq("token", oldToken);
    if (error) {
      console.error("토큰 시간 업데이트 중 예외가 발생했습외다.", error);
      return { updateResult: false, error };
    }
    return { updateResult: true, error: null };
  }
  return { updateResult: false, error: error }
}
// 토큰을 사용하여 구독한 토픽을 가져온다
async function getTopics(token: string): Promise<Result<SupabaseResponse, Error>> {
  const result = await getSupabaseToken(token);
  if (result.kind === 'err') {
    return result
  }
  const result2 = await getSubscriptions(result.value);
  if (result2.kind === 'err') {
    return result2;
  }
  const topicIds = result2.value ? result2.value.data.map((topic) => topic.topic_id) : [];
  const topicResult = await getTopiceNames(topicIds);
  if (topicResult.kind === 'err') {
    return topicResult;
  }
  const topicContents = topicResult.value ? topicResult.value.data.map((topic) => topic.name) : [];
  return createResult({ data: topicContents, error: null });
}

async function getSupabaseToken(token: string): Promise<Result<SupabaseToken, Error>> {
  console.log("토큰 확인", token);
  const { data, error } = await supabaseClient.from("token").select().eq("token", token).returns<{ id: number, token: string, time: string }>();
  if (!error) {
    console.log("토큰 확인 결과", data);
    return { kind: 'ok', value: { data: data } };
  }
  return { kind: 'err', error };
}

async function getSupabaseTopic(topic: string): Promise<Result<SupabaseTopic, Error>> {
  const { data, error } = await supabaseClient.from("topic").select().eq("name", topic).returns<Topic>();
  if (!error) {
    return { kind: 'ok', value: { data: data } };
  }
  return { kind: 'err', error };
}

async function getSubscriptions(result: { data: any }): Promise<Result<SupabaseTopicToToken, Error>> {
  console.log("구독 확인", result);
  const { data, error } = await supabaseClient.from("topic_to_token").select().eq("token_id", result.data.id).returns<TopicToToken[]>();
  if (!error) {
    return { kind: 'ok', value: { data: data } };
  }
  return { kind: 'err', error };
}

async function getTopiceNames(topicIds: number[]): Promise<Result<{ data: Topic[]; }, Error>> {
  const { data, error } = await supabaseClient.from("topic").select().in("id", topicIds).returns<Topic[]>();
  if (!error) {
    return { kind: 'ok', value: { data: data } };
  }
  return { kind: 'err', error };
}

function createResult(params: { data: any; error: any; }): Result<SupabaseResponse, Error> {
  if (!params.error) {
    return { kind: 'ok', value: { data: params.data } };
  }
  return { kind: 'err', error: params.error };

}

type SupabaseResponse = {
  data: {
    id: number;
    token: string;
    time: string;
  }[] | string[] | boolean;
}

type SupabaseToken = {
  data: {
    id: number;
    token: string;
    time: string;
  };
}

interface Topic {
  id: number;
  name: string;
}

type SupabaseTopic = {
  data: Topic;
}

interface TopicToToken {
  id: number;
  token_id: number;
  topic_id: number;
}

type SupabaseTopicToToken = {
  data: Array<TopicToToken>;
}

type Error = {
  error: PostgrestError | null;
} | PostgrestError;

type Result<T, E> = Ok<T> | Err<E>;

interface Ok<T> {
  kind: 'ok';
  value: T;
}

interface Err<E> {
  kind: 'err';
  error: E;
}

export {
  subscribed,
  unsubscribed,
  checkTokenTimeStamps,
  getTopics,
  updateTokenTime,
  grantToken
};
