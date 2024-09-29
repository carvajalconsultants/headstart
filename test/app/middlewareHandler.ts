import type { AnyRouter } from '@tanstack/react-router'
import { Client, cacheExchange, fetchExchange, subscriptionExchange } from 'urql'
import type { EventHandler } from 'vinxi/http'
import { ssr } from './utils/common'
import { GRAPHQL_SERVICE_URL, wsClient } from './utils/websocket'
import { getContext as gContext, useContext } from "unctx";
import { AsyncLocalStorage } from "node:async_hooks";

export type HandlerCallback<TRouter extends AnyRouter> = (ctx: { request: Request; router: TRouter; responseHeaders: Headers }) => Response | Promise<Response>

export type CustomizeStartHandler<TRouter extends AnyRouter> = (cb: HandlerCallback<TRouter>) => EventHandler

export function createCustomHandler<TRouter extends AnyRouter>(eventHandler: CustomizeStartHandler<TRouter>) {
  console.log("check1", eventHandler);

        const nitroAsyncContext = gContext("nitro-app", {
          asyncContext: false,
          AsyncLocalStorage,
  });
console.log("nitroAsyncContext CHECK1", nitroAsyncContext.use());


  return (cb: HandlerCallback<TRouter>): EventHandler => {
    console.log("check2");

    return eventHandler(async ({ request, router, responseHeaders }) => {
      try {
        console.log(`Handling request for ${request.url}`)
        // console.log("router", router);


        /*
        // Ensure wsClient is initialized
        await new Promise<void>(resolve => {
          if (wsClient) {
            resolve()
          } else {
            const checkWsClient = () => {
              if (wsClient) {
                resolve()
              } else {
                setTimeout(checkWsClient, 50)
              }
            }
            checkWsClient()
          }
        })

        const urqlClient = new Client({
          url: GRAPHQL_SERVICE_URL,
          requestPolicy: 'cache-and-network',
          exchanges: [
            cacheExchange,
            ssr,
            // grafastExchange,
            fetchExchange,
            subscriptionExchange({
              forwardSubscription: operation => ({
                subscribe: sink => ({
                  unsubscribe: wsClient.subscribe(
                    {
                      ...operation,
                      query: operation.query ?? '',
                    },
                    sink
                  ),
                }),
              }),
            }),
          ],
        })

        router.update({
          context: {
            urqlClient,
          },
        })
          */

        await router.load()
      } catch (error) {
        throw error
      }
      return cb({ request, router, responseHeaders })
    })
  }
}
