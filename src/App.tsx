import "./App.css";
import { CandlestickChart } from "./components/CandlestickChart";

function App() {
  return (
    <div className="App">
      <h1>XAUUSD</h1>
      <CandlestickChart ticker="xauusd" timeframe="5min" />
    </div>
  );
}

export default App;
