import { createClient as createWSClient } from "graphql-ws";

const GRAPHQL_SUBSCRIPTION_SERVICE_URL = `${import.meta.env.VITE_PUBLIC_SUBSCRIPTION_SERVICE_URL || "wss://ws.origos.io"}/graphql`;

// Subscription client, used to push data to the client side
const wsClient = createWSClient({
  url: GRAPHQL_SUBSCRIPTION_SERVICE_URL,

  connectionParams: (): Record<string, string> => {
    // Authentication token, this is needed here when a subscription
    const token = window.localStorage.getItem('token')

    return {
      authorization: token ? `Bearer ${token}` : '',
    }
  },
})

