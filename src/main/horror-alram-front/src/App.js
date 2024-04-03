import { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get('api/hello')
      .then((response) => {
        setData(response.data);
      })
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {data}
        </p>
      </header>
    </div>
  );
}
export default App;
