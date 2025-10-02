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

  return <span>Next bar in: {remaining}s</span>;
}
