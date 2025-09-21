const API_URL = import.meta.env.VITE_API_URL;

export async function postTrade(trade: any) {
  const res = await fetch(`${API_URL}/trades/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trade),
  });
  if (!res.ok) throw new Error("Failed to save trade");
  return res.json();
}

export async function getTrades() {
  const res = await fetch(`${API_URL}/trades/`);
  if (!res.ok) throw new Error("Failed to fetch trades");
  return res.json();
}
