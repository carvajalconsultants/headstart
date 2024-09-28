# Headstart

Library to assist in integrating PostGraphile with Tanstack Start with URQL.

This library is made up of:

- An URQL Exchange that queries grafast for SSR pages (so we don't make an unecessary HTTP request)
- A Grafserv adapter to work with Tanstack Start, including Web Socket support.
