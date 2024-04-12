import { Subscribe, Unsubscribe, Send, AlarmPermission, DismissingAlarms } from "./messaging";

function App() {
  return (
    <div>
      <h1>알람 허용하기</h1>
      <AlarmPermission />
      <h1>알람 삭제하기</h1>
      <DismissingAlarms />
      <p>클릭해서 구독하고 호러 영화 개봉 알람을 받아보세요</p>
      <Subscribe />
      <p>
        호러 영화 개봉 알람을 받고 싶지 않다면 구독을 취소하세요.
      </p>
      <Unsubscribe />
      <p>
        호러 영화 개봉 알람을 테스트하려면 누르세요
      </p>
      <Send />
    </div>
  );
}

export default App;
