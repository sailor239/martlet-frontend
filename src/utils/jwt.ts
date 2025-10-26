// decode JWT payload without verifying (for frontend use)
export function decodeToken(token: string): { [key: string]: any } {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload); // base64 decode
    return JSON.parse(decoded);
  } catch (err) {
    console.error("Failed to decode token", err);
    return {};
  }
}
