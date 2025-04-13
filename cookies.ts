import Cookies from "js-cookie";

import { getServerCookie, setServerCookie } from "./serverCookies";

import type { CookieSetOptions } from "./serverCookies";

/**
 * Retrieves a cookie value by its name, working seamlessly in both client and server environments.
 * This is crucial for applications that need to maintain state or user preferences across page loads
 * and server-side rendering scenarios.
 *
 * @param name - The unique identifier of the cookie you want to retrieve (e.g., 'user_session', 'theme_preference')
 * @returns The value stored in the cookie if it exists, or undefined if the cookie is not found
 *
 * @example
 * // Get user's theme preference
 * const theme = getCookie('theme_preference');
 * if (theme === 'dark') {
 *   // Apply dark theme
 * }
 */
export const getCookie = async (name: string): Promise<string | undefined> => {
  // Check if code is running in browser
  if (typeof window !== "undefined") {
    // Client-side cookie retrieval
    return Cookies.get(name);
  }

  // Server-side cookie retrieval
  return getServerCookie(name);
};

/**
 * Sets a cookie with the specified name, value, and optional configuration parameters.
 * Essential for storing user preferences, session tokens, or any client-side state that
 * needs to persist across page reloads or browser sessions.
 *
 * @param name - The unique identifier for the cookie (e.g., 'auth_token', 'language_preference')
 * @param value - The data to be stored in the cookie
 * @param options - Configuration object for the cookie
 * @param options.domain - Specifies which domains can access the cookie
 * @param options.expires - When the cookie should expire, either as a Date object or days from now
 * @param options.secure - If true, cookie will only be transmitted over HTTPS
 * @param options.sameSite - Controls how the cookie behaves with cross-site requests
 * @param options.path - The path on the server the cookie is valid for
 *
 * @example
 * // Set a session cookie that expires in 7 days
 * setCookie('session_id', 'abc123', {
 *   expires: 7,
 *   secure: true,
 *   sameSite: 'strict'
 * });
 */
export const setCookie = async (name: string, value: string, options?: CookieSetOptions) => {
  if (typeof window !== "undefined") {
    // Set cookie on the client side without hitting the server
    Cookies.set(name, value, options);

    return;
  }

  // Set cookie on the server side
  await setServerCookie(name, value, options);
};

/**
 * Removes a cookie from the browser, effectively logging out users or clearing stored preferences.
 * Useful for scenarios like user logout, clearing cached data, or resetting user preferences.
 *
 * @param name - The name of the cookie to remove (e.g., 'auth_token', 'user_session')
 *
 * @example
 * // Clear user session during logout
 * removeCookie('auth_token');
 * removeCookie('user_preferences');
 */
export const removeCookie = async (name: string) => {
  if (typeof window !== "undefined") {
    // Remove cookie on the client side without hitting the server
    return Cookies.remove(name);
  }

  // Remove cookie on the server side
  return setCookie(name, "", { expires: new Date(0) });
};
