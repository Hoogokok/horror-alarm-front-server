import {BrowserRouter,} from 'react-router-dom'
import MainTabs from "./components/MainTab";
import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background: #FFFFFF;
  }
`;

function App() {
  return (
      <BrowserRouter>
        <GlobalStyle/>
        <MainTabs/>
      </BrowserRouter>
  );
}

export default App;
