import { useState, useEffect } from "react";

interface ClockProps {
  timeZone?: string; // e.g., "UTC", "Asia/Singapore", "America/New_York"
}

export default function TimezoneClock({ timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  }).format(time);

  return (
    <div style={{ fontSize: "1.25rem", fontFamily: "monospace" }}>
      {formattedTime} <span style={{ fontSize: "0.9rem" }}>({timeZone})</span>
    </div>
  );
}
