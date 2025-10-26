const API_URL = import.meta.env.VITE_API_URL;

// Helper to get headers with JWT
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : { "Content-Type": "application/json" };
}

// --- Auth API ---
export async function loginUser(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", username); // required by OAuth2PasswordRequestForm
  formData.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) throw new Error("Failed to login");
  return res.json();
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Registration failed");
  }

  return res.json();
}

// --- Trades API ---
export async function postTrade(trade: any) {
  const res = await fetch(`${API_URL}/trades/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(trade),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to save trade");
  }

  return res.json();
}

export async function getTrades() {
  const res = await fetch(`${API_URL}/trades/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to fetch trades");
  }

  return res.json();
}

// --- Example: Backtest API ---
// export async function getBacktestResults(ticker: string, timeframe: string) {
//   const res = await fetch(
//     `${API_URL}/backtest/results?ticker=${ticker}&timeframe=${timeframe}`,
//     { headers: getAuthHeaders() }
//   );

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.detail || "Failed to fetch backtest results");
//   }

//   return res.json();
// }
