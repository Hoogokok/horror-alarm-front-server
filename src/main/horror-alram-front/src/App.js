import { Subscribe, Unsubscribe } from "./messaging";

function App() {
  return (
    <div>
      <Subscribe />
      <h1>Horror Alarm</h1>
      <p>클릭해서 구독하고 알람을 받아보세요</p>
      <Unsubscribe />
      <p>
        알람을 받지 않으려면 클릭하세요
      </p>
    </div>
  );
}

export default App;
