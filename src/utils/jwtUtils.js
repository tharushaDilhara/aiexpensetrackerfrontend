// utils/jwtUtils.js or anywhere convenient
import {jwtDecode} from "jwt-decode"

export default function isTokenExpired(token) {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false; // No exp claim = no expiry (rare)

    const currentTime = Date.now() / 1000; // exp is in seconds
    return decoded.exp < currentTime;
  } catch (error) {
    // Invalid token format
    return true;
  }
}

export function getTokenExpiry(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null; // Convert to milliseconds
  } catch {
    return null;
  }
}