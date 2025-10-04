import React, { useEffect, useState } from "react";

interface CandleCountdownProps {
  timeframe: number; // in seconds
  lastCandleTime: Date;
}

export default function CandleCountdown({ timeframe, lastCandleTime }: CandleCountdownProps) {
  const [remaining, setRemaining] = useState(timeframe);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - lastCandleTime.getTime()) / 1000);
      const left = timeframe - (elapsed % timeframe);
      setRemaining(left);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeframe, lastCandleTime]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <span style={{ fontWeight: 500, color: "#3b82f6" }}>
      Next bar in: {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}

