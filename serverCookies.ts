export interface CookieSetOptions {
  /**
   * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.3|Domain Set-Cookie attribute}. By default, no
   * domain is set, and most clients will consider the cookie to apply to only
   * the current domain.
   */
  domain?: string | undefined;
  /**
   * Specifies a function that will be used to encode a cookie's value. Since
   * value of a cookie has a limited character set (and must be a simple
   * string), this function can be used to encode a value into a string suited
   * for a cookie's value.
   *
   * The default function is the global `encodeURIComponent`, which will
   * encode a JavaScript string into UTF-8 byte sequences and then URL-encode
   * any that fall outside of the cookie range.
   */
  encode?(value: string): string;
  /**
   * Specifies the `Date` object to be the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.1|`Expires` `Set-Cookie` attribute}. By default,
   * no expiration is set, and most clients will consider this a "non-persistent cookie" and will delete
   * it on a condition like exiting a web browser application.
   *
   * *Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
   * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
   * possible not all clients by obey this, so if both are set, they should
   * point to the same date and time.
   */
  expires?: Date | number | undefined;
  /**
   * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.6|`HttpOnly` `Set-Cookie` attribute}.
   * When truthy, the `HttpOnly` attribute is set, otherwise it is not. By
   * default, the `HttpOnly` attribute is not set.
   *
   * *Note* be careful when setting this to true, as compliant clients will
   * not allow client-side JavaScript to see the cookie in `document.cookie`.
   */
  httpOnly?: boolean | undefined;
  /**
   * Specifies the number (in seconds) to be the value for the `Max-Age`
   * `Set-Cookie` attribute. The given number will be converted to an integer
   * by rounding down. By default, no maximum age is set.
   *
   * *Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
   * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
   * possible not all clients by obey this, so if both are set, they should
   * point to the same date and time.
   */
  maxAge?: number | undefined;
  /**
   * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.4|`Path` `Set-Cookie` attribute}.
   * By default, the path is considered the "default path".
   */
  path?: string | undefined;
  /**
   * Specifies the `string` to be the value for the [`Priority` `Set-Cookie` attribute][rfc-west-cookie-priority-00-4.1].
   *
   * - `'low'` will set the `Priority` attribute to `Low`.
   * - `'medium'` will set the `Priority` attribute to `Medium`, the default priority when not set.
   * - `'high'` will set the `Priority` attribute to `High`.
   *
   * More information about the different priority levels can be found in
   * [the specification][rfc-west-cookie-priority-00-4.1].
   *
   * **note** This is an attribute that has not yet been fully standardized, and may change in the future.
   * This also means many clients may ignore this attribute until they understand it.
   */
  priority?: "low" | "medium" | "high" | undefined;
  /**
   * Specifies the boolean or string to be the value for the {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|`SameSite` `Set-Cookie` attribute}.
   *
   * - `true` will set the `SameSite` attribute to `Strict` for strict same
   * site enforcement.
   * - `false` will not set the `SameSite` attribute.
   * - `'lax'` will set the `SameSite` attribute to Lax for lax same site
   * enforcement.
   * - `'strict'` will set the `SameSite` attribute to Strict for strict same
   * site enforcement.
   *  - `'none'` will set the SameSite attribute to None for an explicit
   *  cross-site cookie.
   *
   * More information about the different enforcement levels can be found in {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|the specification}.
   *
   * *note* This is an attribute that has not yet been fully standardized, and may change in the future. This also means many clients may ignore this attribute until they understand it.
   */
  sameSite?: "lax" | "strict" | "none" | undefined;
  /**
   * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.5|`Secure` `Set-Cookie` attribute}. When truthy, the
   * `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.
   *
   * *Note* be careful when setting this to `true`, as compliant clients will
   * not send the cookie back to the server in the future if the browser does
   * not have an HTTPS connection.
   */
  secure?: boolean | undefined;
  /**
   * Specifies the `boolean` value for the [`Partitioned` `Set-Cookie`](https://datatracker.ietf.org/doc/html/draft-cutler-httpbis-partitioned-cookies#section-2.1)
   * attribute. When truthy, the `Partitioned` attribute is set, otherwise it is not. By default, the
   * `Partitioned` attribute is not set.
   *
   * **note** This is an attribute that has not yet been fully standardized, and may change in the future.
   * This also means many clients may ignore this attribute until they understand it.
   *
   * More information can be found in the [proposal](https://github.com/privacycg/CHIPS).
   */
  partitioned?: boolean;
}

/**
 * Retrieves a cookie value during server-side rendering (SSR)
 * This is useful when you need to access cookies that were set by the server
 * before the page is sent to the client, such as authentication tokens or user preferences
 *
 * @param name - The name of the cookie to retrieve
 * @returns The cookie value if running on the server, undefined if on the client
 */
export const getServerCookie = async (name: string) => {
  // Only execute this logic during server-side rendering: https://v3.vitejs.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    // Dynamically import the cookie getter to avoid loading it on the client bundle
    const { getCookie } = await import("@tanstack/react-start-server");

    return getCookie(name);
  }

  return undefined;
};

/**
 * Sets a cookie during server-side rendering (SSR)
 * This is essential for scenarios where you need to set cookies before the initial page load,
 * such as storing session tokens, user preferences, or other server-determined values
 *
 * @param name - The name of the cookie to set
 * @param value - The value to store in the cookie
 * @param options - Cookie configuration options
 * @param options.expires - Expiration date or time in days from now
 * @param options.path - Path where the cookie is valid
 * @param options.domain - Domain where the cookie is valid
 * @param options.secure - Whether the cookie should only be transmitted over HTTPS
 * @param options.httpOnly - Whether the cookie should be inaccessible to JavaScript
 * @param options.sameSite - Controls how the cookie behaves with cross-site requests
 */
export const setServerCookie = async (name: string, value: string, options?: CookieSetOptions) => {
  // Only execute this logic during server-side rendering: https://v3.vitejs.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    // Dynamically import the cookie setter to avoid loading it on the client bundle
    const { setCookie: setStartCookie } = await import("@tanstack/react-start-server");

    // Set the cookie with provided options, converting numeric expiry to actual date
    // This handles both relative (days from now) and absolute date expiration times
    setStartCookie(name, value, {
      ...options,
      expires:
        typeof options?.expires === "number"
          ? new Date(Date.now() + options.expires * 864e5) // Convert days to milliseconds (864e5 = 24 * 60 * 60 * 1000)
          : options?.expires,
    });
  }
};
