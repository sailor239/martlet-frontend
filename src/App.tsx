import "./App.css";
import { CandlestickChart } from "./components/CandlestickChart";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

function App() {
  return (
    <div className="App">
      <h1>XAUUSD</h1>
      <CandlestickChart />
    </div>
  );
}

export default App;
