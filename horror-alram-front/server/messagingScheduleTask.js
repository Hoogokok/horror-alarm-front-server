import {createClient} from "@supabase/supabase-js";
import {config} from "dotenv";

config();
const supabaseClient = createClient(process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY);

async function writeNotificationMessage(topicName, getData, formatMessage) {
  const {data: topicData, error: topicError} = await supabaseClient.from(
      'topic').select("name").eq('name', topicName);
  const {
    data: subscriptionData,
    error: subscriptionError
  } = await supabaseClient.from('topic_to_token').select("token_id").eq(
      'topic_id', topicData[0].id);
  const {data: tokenData, error: tokenError} = await supabaseClient.from(
      'token').select("token").in('id',
      subscriptionData.map((item) => item.id));

  if (!topicError && !subscriptionError && !tokenError) {
    const {data, error} = await getData();
    if (!error) {
      const registrationTokens = tokenData.map((item) => item.token);
      return formatMessage(data, registrationTokens);
    }
  }
}

//매주 일요일 오전 10시에 스트리밍 종료예정 영화가 존재하면 알림을 보낸다.
async function netflixExpiringJob() {
  return await writeNotificationMessage('netflix_expiring', async () => {
    return supabaseClient.from('netflix_horror_expiring').select(
        "title, expired_date, the_movie_db_id");
  }, async (data, registrationTokens) => {
    // 스트리밍 종료 예정 정보가 영어로 되어 있어 한국어 정보를 찾아 바꾼다.
    const {
      data: netflixHorrorKrData,
      error: netflixHorrorKrError
    } = await supabaseClient.from('netflix_horror_kr').select("title").in(
        'the_movie_db_id', data.map((movie) => movie.the_movie_db_id));

    const value = data.map((movie) => {
      return netflixHorrorKrData.find(
              (item) => item.the_movie_db_id === movie.the_movie_db_id).title
          + " : " + movie.expired_date;
    }).join('\n');

    return {
      data: {
        title: '넷플릭스 스트리밍 종료 예정 알림',
        body: JSON.stringify(value)
      },
      topic: 'netflix_expiring'
    }
  });
}

// 매주 일요일 10시 새로운 공포영화가 개봉하면 알림을 보낸다.
async function upcomingMovieJob() {
  return await writeNotificationMessage('upcoming_movie', async () => {
    return supabaseClient.from('upcoming_movie').select(
        "title, release_date");
  }, (data, registrationTokens) => {
    const value = data.map((movie) => {
      return movie.title + " : " + movie.release_date;
    }).join('\n');
    return {
      data: {
        title: '새로운 공포영화 알림',
        body: JSON.stringify(value)
      },
      topic: 'upcoming_movie'
    };
  });
}

export {netflixExpiringJob, upcomingMovieJob};

