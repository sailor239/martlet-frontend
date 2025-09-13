export type Candle = {
  timestamp: string;
  timestamp_sgt: string;
  open: number;
  high: number;
  low: number;
  close: number;
  trading_date: string;
  ema20: number | null;
  prev_day_high: number | null;
  prev_day_low: number | null;
};
