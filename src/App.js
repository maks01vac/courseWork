
import './App.css';

import Header from './components/header/Header';
import Main from './components/main/Main';
import Calc from './components/calc/Calc.jsx'
import Fotter from './components/fotter/Fotter';

function App() {
  return (
    <div className="App">
      <Header/>
      <Main/>
      <Fotter/>
    </div>
  );
}

export default App;
